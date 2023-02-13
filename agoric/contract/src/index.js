/* eslint-disable no-undef */
// @ts-check
import '@agoric/zoe/exported';
import { AssetKind, AmountMath } from '@agoric/ertp';
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';
import { errors } from './errors';
import { mulberry32 } from './prng';
import { messages } from './messages';
import { makeCharacterNftObjs, makeStorageNodePublishKit } from './utils';
import { market } from './market';
import { inventory } from './inventory';
import { kreadState } from './kread-state';

/**
 * This contract handles the mint of KREAd characters,
 * along with its corresponding item inventories and keys.
 * It also allows for equiping and unequiping items to
 * and from the inventory, using a token as access
 *
 * @type {ContractStartFn}
 * @param {ZCF} zcf
 * @param {{
 *   baseCharacters: object[],
 *   defaultItems: object[],
 *   seed: number
 *   moneyIssuer: Issuer<"nat">
 *   moneyBrand: Brand<"nat">
 *   chainTimerService: TimerService
 * }} privateArgs
 * */
// @param {{storageNode: StorageNode, marshaller: Marshaller}} privateArgs
const start = async (zcf, privateArgs) => {
  const assetNames = {
    character: 'KREAdCHARACTER',
    item: 'KREAdITEM',
    paymentNFT: 'KREAdTOKEN',
  };

  // Define Assets
  const assetMints = await Promise.all([
    zcf.makeZCFMint(assetNames.character, AssetKind.SET),
    zcf.makeZCFMint(assetNames.item, AssetKind.SET),
    zcf.makeZCFMint(assetNames.paymentNFT, AssetKind.NAT), // TODO: Change to IST
  ]);

  const [
    { issuer: characterIssuer, brand: characterBrand },
    { issuer: itemIssuer, brand: itemBrand },
    { issuer: paymentFTIssuer, brand: paymentFTBrand },
  ] = assetMints.map((mint) => mint.getIssuerRecord());

  const [characterMint, itemMint, paymentFTMint] = assetMints;

  const config = {
    tokenData: {
      characters: privateArgs.baseCharacters,
      items: privateArgs.defaultItems,
    },
    defaultPaymentToken: {
      issuer: privateArgs.moneyIssuer,
      brand: privateArgs.moneyBrand,
    },
    timerService: privateArgs.chainTimerService,
    ready: false,
  };

  assert(!Number.isNaN(privateArgs.seed), X`${errors.seedInvalid}`);

  /** @type KreadState  */
  let state = kreadState({
    assetMints: {
      character: characterMint,
      item: itemMint,
      paymentFT: paymentFTMint,
    },
    tokenInfo: {
      character: {
        name: assetNames.character,
        brand: characterBrand,
        issuer: characterIssuer,
      },
      item: {
        name: assetNames.item,
        brand: itemBrand,
        issuer: itemIssuer,
      },
      paymentFT: {
        name: assetNames.paymentFT,
        brand: paymentFTBrand,
        issuer: paymentFTIssuer,
      },
    },
    config,
    randomNumber: mulberry32(privateArgs.seed),
  });

  const characterHistory = {};
  const itemHistory = {};

  /**
   * Set contract configuration, required for most contract features,
   * base characters will be picked at random on new mint
   * default items will be minted along each character
   * seed is used to init the PRNG
   *
   * @param {{
   *   baseCharacters: object[],
   *   defaultItems: object[],
   *   seed: number
   *   moneyIssuer: Issuer<"nat">
   *   moneyBrand: Brand<"nat">
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
    const kreadConfig = {
      tokenData: {
        characters: baseCharacters,
        items: defaultItems,
      },
      defaultPaymentToken: {
        issuer: moneyIssuer,
        brand: moneyBrand,
      },
      timerService: chainTimerService,
      ready: false,
    };

    assert(!Number.isNaN(seed), X`${errors.seedInvalid}`);

    state = kreadState({
      config: kreadConfig,
      assetMints: {
        character: characterMint,
        item: itemMint,
        paymentFT: paymentFTMint,
      },
      tokenInfo: {
        character: {
          name: assetNames.character,
          brand: characterBrand,
          issuer: characterIssuer,
        },
        item: {
          name: assetNames.item,
          brand: itemBrand,
          issuer: itemIssuer,
        },
        paymentFT: {
          name: assetNames.paymentFT,
          brand: paymentFTBrand,
          issuer: paymentFTIssuer,
        },
      },
      randomNumber: mulberry32(seed),
    });

    return 'Setup complete';
  };

  /**
   * Stores the storage node and marshaller
   * and creates the relevant notifiers
   *
   * @param { Powers } powers
   */
  const addStorageNode = ({ storageNode, marshaller }) => {
    assert(storageNode && marshaller, X`${errors.invalidArg}`);

    const notifiers = {
      market: {
        characters: makeStorageNodePublishKit(
          storageNode,
          marshaller,
          'market-characters',
        ),
        items: makeStorageNodePublishKit(
          storageNode,
          marshaller,
          'market-items',
        ),
      },
      inventory: makeStorageNodePublishKit(
        storageNode,
        marshaller,
        'inventory-general',
      ),
    };

    state.set.powers(
      {
        storageNode,
        marshaller,
      },
      notifiers,
    );

    return 'Storage Node added successfully';
  };

  /**
   * Mints Item NFTs via mintGains
   *
   * @param {ZCFSeat} seat
   */
  const mintItemNFT = async (seat) => {
    assert(state.get.isReady(), X`${errors.noConfig}`);

    const { want } = seat.getProposal();

    const currentTime = await state.get.time();

    // @ts-ignore
    const items = want.Item.value.map((item) => {
      const id = state.get.count().items;
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
    assert(state.get.isReady(), X`${errors.noConfig}`);

    const { want } = seat.getProposal();
    const currentTime = await state.get.time();
    const newCharacterName = want.Asset.value[0].name;
    assert(
      state.validate.nameIsUnique(newCharacterName),
      X`${errors.nameTaken}`,
    );

    const [newCharacterAmount1, newCharacterAmount2] = makeCharacterNftObjs(
      newCharacterName,
      state.get.randomBaseCharacter(),
      state.get.count().characters,
      currentTime,
    ).map((character) => AmountMath.make(characterBrand, harden([character])));

    const { zcfSeat: inventorySeat } = zcf.makeEmptySeatKit();

    // Mint character to user seat & inventorySeat
    characterMint.mintGains({ Asset: newCharacterAmount1 }, seat);
    characterMint.mintGains(
      { CharacterKey: newCharacterAmount2 },
      inventorySeat,
    );

    // Mint items to inventory seat
    const allDefaultItems = Object.values(state.get.defaultItems());
    const uniqueItems = allDefaultItems.map((item) => {
      /** @type {ItemRecord} */
      const newItemWithId = {
        ...item,
        id: state.get.count().items,
      };
      return newItemWithId;
    });

    const itemsAmount = AmountMath.make(itemBrand, harden(uniqueItems));
    itemMint.mintGains({ Item: itemsAmount }, inventorySeat);

    const powers = state.get.powers();
    assert(powers);

    const inventoryNotifier = makeStorageNodePublishKit(
      powers.storageNode,
      powers.marshaller,
      `inventory-${newCharacterName}`,
    );

    // Add to state
    /**
     * @type {CharacterRecord}
     */
    const character = {
      name: newCharacterName,
      character: newCharacterAmount1.value[0],
      inventory: inventorySeat,
      publisher: inventoryNotifier.publisher,
    };

    state.add.characters([character]);
    state.add.items(uniqueItems);

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

    inventoryNotifier.publisher.publish(
      inventorySeat.getAmountAllocated('Item').value,
    );

    seat.exit();

    return messages.mintCharacterReturn;
  };

  // Opportunity for more complex queries
  // const getCharacters = () => {
  //   return harden({
  //     characters: state.characters,
  //   });
  // };

  // const getCharactersMarket = () => {
  //   return harden({
  //     characters: state.charactersMarket,
  //   });
  // };

  // const getItems = () => {
  //   return harden({
  //     items: state.items,
  //   });
  // };

  // const getItemsMarket = () => {
  //   return harden({
  //     items: state.itemsMarket,
  //   });
  // };

  /**
   *
   * @param {ZCFSeat} seat
   */
  const tokenFacet = (seat) => {
    const { want } = seat.getProposal();
    paymentFTMint.mintGains(want, seat);
    seat.exit();
    return 'Success';
  };

  const creatorFacet = Far('Character store creator', {
    initConfig,
    getCharacterIssuer: () => characterIssuer,
    getItemIssuer: () => itemIssuer,
    getItemBrand: () => itemBrand,
    getState: () => state,
  });

  const publicFacet = Far('Chracter store public', {
    addStorageNode, // FIXME: RESTRICT PRIVILEGED FN
    makeTokenFacetInvitation: () =>
      zcf.makeInvitation(tokenFacet, 'get tokens'), // FIXME: RESTRICT PRIVILEGED FN

    // public state getters
    ...state.public,

    // equip/unequip
    ...inventory(zcf, () => state),

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

    ...market(zcf, () => state),
    // getMarketData: () => ({ characters: characterMarket, items: itemMarket }),
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
