/* eslint-disable no-undef */
// @ts-check
import '@agoric/zoe/exported';
import { AssetKind, AmountMath } from '@agoric/ertp';
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js';
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';
import { makeNotifierKit } from '@agoric/notifier';
import { errors } from './errors';
import { mulberry32 } from './prng';
import { messages } from './messages';
import * as state from './get';
import { getPage, makeCharacterNftObjs } from './utils';
import { market } from './market';
import { inventory } from './inventory';

/**
 * This contract handles the mint of KREAd characters,
 * along with its corresponding item inventories and keys.
 * It also allows for equiping and unequiping items to
 * and from the inventory, using a token as access
 *
 * @type {ContractStartFn}
 * @param {ZCF} zcf
 *
 */
// @param {{storageNode: StorageNode, marshaller: Marshaller}} privateArgs
const start = async (zcf) => {
  // Define Assets
  const assetMints = await Promise.all([
    zcf.makeZCFMint('KREAdCHARACTER', AssetKind.SET),
    zcf.makeZCFMint('KREAdITEM', AssetKind.SET),
    zcf.makeZCFMint('KREAdTOKEN', AssetKind.NAT), // TODO: Change to IST
  ]);

  const [
    { issuer: characterIssuer, brand: characterBrand },
    { issuer: itemIssuer, brand: itemBrand },
    { issuer: tokenIssuer, brand: tokenBrand },
  ] = assetMints.map((mint) => mint.getIssuerRecord());

  const [characterMint, itemMint, tokenMint] = assetMints;

  let PRNG; // Pseudo random number generator (mulberry32)

  /**
   * Contract STATE
   *
   * @type {State}
   */
  const STATE = {
    config: undefined, // Holds list of base characters and default items
    characters: [], // Holds each character's inventory + copy of its data
    charactersMarket: [],
    items: [],
    itemsMarket: [],
    itemCount: 0n,
    characterCount: 0n,
    assets: {
      character: {
        brand: characterBrand,
        issuer: characterIssuer,
      },
      item: {
        brand: itemBrand,
        issuer: itemIssuer,
      },
      token: {
        brand: tokenBrand,
        issuer: tokenIssuer,
      },
    },
  };

  const characterHistory = {};
  const itemHistory = {};

  /**
   * Set contract configuration, required for most contract features,
   * base characters will be picked at random on new mint
   * default items will be minted along each character
   * seed is used to init the PRNG
   *
   * @param {{
   *   baseCharacters: any[],
   *   defaultItems: any[],
   *   seed: number
   *   moneyIssuer: Issuer
   *   moneyBrand: Brand
   *   chainTimerService: TimerService
   * }} config
   * @returns {string}
   */
  const initConfig = ({
    baseCharacters,
    defaultItems,
    seed,
    moneyIssuer,
    moneyBrand,
    chainTimerService,
  }) => {
    STATE.config = {
      baseCharacters,
      defaultItems,
      completed: true,
      moneyIssuer,
      moneyBrand,
      chainTimerService,
    };
    assert(!Number.isNaN(seed), X`${errors.seedInvalid}`);
    PRNG = mulberry32(seed);
    STATE.randomNumber = PRNG;
    return 'Setup completed';
  };

  /**
   *
   * @param { StorageNode } storageNode
   * @param { Marshaller } marshaller
   */
  const addStorageNode = (storageNode, marshaller) => {
    STATE.powers = {
      storageNode,
      marshaller,
    };
    assert(storageNode && marshaller, X`${errors.invalidArg}`);
    STATE.powers = { storageNode, marshaller };
    return 'Storage Node added successfully';
  };

  /**
   * Mints Item NFTs via mintGains
   *
   * @param {ZCFSeat} seat
   */
  const mintItemNFT = async (seat) => {
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      want: { Item: null },
    });
    const { want } = seat.getProposal();

    // @ts-ignore
    const currentTime = await state.getCurrentTime(STATE);

    // @ts-ignore
    const items = want.Item.value.map((item) => {
      const id = STATE.itemCount;
      STATE.itemCount = 1n + STATE.itemCount;
      return { ...item, id, date: currentTime };
    });

    const newItemAmount = AmountMath.make(itemBrand, harden(items));
    itemMint.mintGains({ Asset: newItemAmount }, seat);

    seat.exit();

    // Add to history

    items.forEach((item) => {
      itemHistory[item.id.toString()] = [
        {
          type: 'mint',
          data: item,
          timestamp: currentTime,
        },
      ];
    });

    return messages.mintItemReturn;
  };

  /**
   * Mints a new character
   *
   * @param {ZCFSeat} seat
   */
  const mintCharacterNFT = async (seat) => {
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    // TODO add Give statement with Money
    assertProposalShape(seat, {
      want: {
        Asset: null,
      },
    });
    const { want } = seat.getProposal();
    const newCharacterName = want.Asset.value[0].name;
    assert(state.nameIsUnique(newCharacterName, STATE), X`${errors.nameTaken}`);

    const currentTime = await state.getCurrentTime(STATE);
    STATE.characterCount = 1n + STATE.characterCount;
    const [newCharacterAmount1, newCharacterAmount2] = makeCharacterNftObjs(
      newCharacterName,
      state.getRandomBaseCharacter(STATE),
      STATE.characterCount,
      currentTime,
    ).map((character) => AmountMath.make(characterBrand, harden([character])));

    const { zcfSeat: inventorySeat } = zcf.makeEmptySeatKit();

    // Set up notifiers
    const { notifier, updater } = makeNotifierKit();

    // Mint character to user seat & inventorySeat
    characterMint.mintGains({ Asset: newCharacterAmount1 }, seat);
    characterMint.mintGains(
      { CharacterKey: newCharacterAmount2 },
      inventorySeat,
    );

    // Mint items to inventory seat
    // TODO: Replace Date by a valid time generator now it returns NaN
    const allDefaultItems = Object.values(STATE.config.defaultItems);
    const uniqueItems = allDefaultItems.map((item) => {
      const newItemWithId = {
        ...item,
        id: STATE.itemCount,
      };

      STATE.itemCount = 1n + STATE.itemCount;

      return newItemWithId;
    });

    const itemsAmount = AmountMath.make(itemBrand, harden(uniqueItems));
    itemMint.mintGains({ Item: itemsAmount }, inventorySeat);

    // Add to public STATE
    /**
     * @type {CharacterRecord}
     */
    const character = {
      name: newCharacterName,
      character: newCharacterAmount1.value[0],
      inventory: inventorySeat,
      notifier,
      updater,
    };
    STATE.characters = [...STATE.characters, character];

    // Add to history
    characterHistory[character.name] = [
      {
        type: 'mint',
        data: character,
        timestamp: currentTime,
      },
    ];
    uniqueItems.forEach((item) => {
      itemHistory[item.id.toString()] = [
        {
          type: 'mint',
          data: item,
          timestamp: currentTime,
        },
      ];
    });

    seat.exit();

    return messages.mintCharacterReturn;
  };

  // Opportunity for more complex queries
  const getCharacters = () => {
    return harden({
      characters: STATE.characters,
    });
  };

  const getCharactersMarket = () => {
    return harden({
      characters: STATE.charactersMarket,
    });
  };

  const getItems = () => {
    return harden({
      items: STATE.items,
    });
  };

  const getItemsMarket = () => {
    return harden({
      items: STATE.itemsMarket,
    });
  };

  /**
   *
   * @param {ZCFSeat} seat
   */
  const tokenFacet = (seat) => {
    const { want } = seat.getProposal();
    tokenMint.mintGains(want, seat);
    seat.exit();
    return 'Success';
  };

  const creatorFacet = Far('Character store creator', {
    initConfig,
    getCharacterIssuer: () => characterIssuer,
    getItemIssuer: () => itemIssuer,
    getItemBrand: () => itemBrand,
    getCharacters,
    getConfig: () => STATE.config,
  });

  const publicFacet = Far('Chracter store public', {
    addStorageNode,
    makeTokenFacetInvitation: () =>
      zcf.makeInvitation(tokenFacet, 'get tokens'),
    // config
    getConfig: () => STATE.config,
    getPowers: () => ({ powers: STATE.powers, config: STATE.config }),
    getAssets: () => [
      STATE.assets?.character,
      STATE.assets?.item,
      STATE.assets?.token,
    ],
    // characters
    getCharacterInventoryNotifier: (characterName) =>
      state.getCharacterInventoryNotifier(characterName, STATE),
    getCharacterBase: () => STATE.config?.baseCharacters[0],
    getCharacters,
    getCharactersRange: (range, page) => getPage(STATE.characters, range, page),
    getCharactersMarket,
    getCharactersMarketRange: (range, page) =>
      getPage(STATE.charactersMarket, range, page),
    getCharacterInventory: (name) => state.getCharacterInventory(name, STATE),
    getCharacterKey: (name) => state.getCharacterKey(name, STATE),
    getCharacterCount: () => STATE.characters.length,
    getCharacterIssuer: () => characterIssuer,
    getCharacterBrand: () => characterBrand,
    randomBaseCharacter: () => state.getRandomBaseCharacter(STATE),
    // TODO: improve name validation
    isValidName: state.nameIsUnique,
    // items
    getItems,
    getItemsMarket,
    getItemsMarketRange: (range, page) =>
      getPage(STATE.itemsMarket, range, page),
    getItemIssuer: () => itemIssuer,
    getItemBrand: () => itemBrand,
    randomItem: () => state.getRandomItem(STATE),

    // equip/unequip
    ...inventory(zcf, STATE),

    // mint
    makeMintCharacterInvitation: () =>
      zcf.makeInvitation(mintCharacterNFT, 'mintCharacterNfts'),
    makeMintItemInvitation: () =>
      zcf.makeInvitation(mintItemNFT, 'mintItemNfts'),

    // activity
    getCharacterHistory: (characterId) => characterHistory[characterId],
    getItemHistory: (id) => itemHistory[id],
    getAllCharacterHistory: () => characterHistory.entries(),
    getAllItemHistory: () => itemHistory.entries(),

    ...market(zcf, STATE),
    // getMarketData: () => ({ characters: characterMarket, items: itemMarket }),
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
