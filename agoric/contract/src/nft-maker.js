// @ts-check
import '@agoric/zoe/exported';
import { AssetKind, AmountMath } from '@agoric/ertp';
import {
  satisfies,
  assertProposalShape,
} from '@agoric/zoe/src/contractSupport/index.js';
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';
import { errors } from './errors';
import { mulberry32 } from './prng';

/**
 * @typedef {{
 * characterNames: string[]
 * characters: CharacterRecord[]
 * config?: Config
 * mintNext: string
 * }} State
 * @typedef {{
 * baseCharacters: object[]
 * defaultItems: object[]
 * completed?: boolean
 * }} Config
 * @typedef {{
 * name: string
 * character: object
 * inventory: ZCFSeat
 * seat?: ZCFSeat
 * auction?: {
 *   instance: Instance,
 *   publicFacet: any,
 * },
 * }} CharacterRecord
 * @typedef {{
 * noseline?: Item;
 * midBackground?: Item;
 * mask?: Item;
 * headPiece?: Item;
 * hair?: Item;
 * frontMask?: Item;
 * liquid?: Item;
 * background?: Item;
 * airResevoir?: Item;
 * clothing?: Item;
 * }}
 * @typedef {{
 * name: string;
 * category: string;
 * id: string;
 * description: string;
 * image: string;
 * level: number;
 * rarity: number;
 * effectiveness?: number;
 * layerComplexity?: number;
 * forged: string;
 * baseMaterial: string;
 * colors: string[];
 * projectDescription: string;
 * price: number;
 * details: any;
 * date: string;
 * slots?: any[];
 * activity: any[];
 * }} Item
 */

/**
 * This contract mints non-fungible tokens (Characters) and creates a contract
 * instance to auction the Characters in exchange for some sort of money.
 *
 * @type {ContractStartFn}
 */
const start = async (zcf) => {
  // Define Assets
  const characterMint = await zcf.makeZCFMint('KREA', AssetKind.SET);
  const { issuer: characterIssuer, brand: characterBrand } =
    characterMint.getIssuerRecord();

  // Define Items
  const itemMint = await zcf.makeZCFMint('KREAITEM', AssetKind.SET);
  const { issuer: itemIssuer, brand: itemBrand } = itemMint.getIssuerRecord();

  let PRNG;

  /**
   * Mutable contract state
   *
   * @type {State}
   */
  const state = {
    config: undefined,
    characterNames: [],
    characters: [],
    mintNext: 'PABLO',
  };
  /**
   * Set contract configuration, must be called befor most methods
   *
   * @param {{
   * baseCharacters: any[],
   * defaultItems: any[],
   * seed: number
   * }} config
   * @returns {string}
   */
  const initConfig = ({ baseCharacters, defaultItems, seed }) => {
    state.config = {
      baseCharacters,
      defaultItems,
      completed: true,
    };
    assert(!Number.isNaN(seed), X`Seed must be a number`);
    PRNG = mulberry32(seed);
    return 'Setup completed';
  };

  // SEAT UTILITY FUNCTIONS
  /**
   * Checks if giveSeat satisfies wantSeat
   *
   * @param {ZCFSeat} wantSeat
   * @param {ZCFSeat} giveSeat
   * @returns {boolean}
   */
  const satisfiedBy = (wantSeat, giveSeat) =>
    satisfies(zcf, wantSeat, giveSeat.getCurrentAllocation());
  /**
   * Checks if two seats satisfy each other
   *
   * @param {ZCFSeat} seatA
   * @param {ZCFSeat} seatB
   * @returns {boolean}
   */
  const seatsFulfilled = (seatA, seatB) =>
    satisfiedBy(seatA, seatB) && satisfiedBy(seatB, seatA);

  /**
   * TODO: establish a rarity system set by the creator of the character set
   * TODO: add character type in return
   */
  const getRandomBaseCharacter = () => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    const number = Math.floor(PRNG() * state.config.baseCharacters.length);
    return state.config.baseCharacters[number];
  };
  /**
   * TODO: establish a rarity system set by the creator of the character set
   * TODO: add character type in return
   */
  const getRandomItem = () => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    const number = Math.floor(PRNG() * state.config.defaultItems.length);
    return state.config.defaultItems[number];
  };

  /**
   * @param {string} name
   * @returns {boolean}
   */
  const nameIsUnique = (name) => {
    return !state.characterNames.includes(name);
  };

  /**
   * Mints a new character to a depositFacet
   *
   * @param {ZCFSeat} seat
   */
  const mintItemNFT = (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      want: { Item: null },
    });
    // Mint character to user seat
    const { want } = seat.getProposal();
    itemMint.mintGains(want, seat);

    seat.exit();

    return 'You minted an Item NFT!';
  };

  /**
   * Mints a new character to a depositFacet
   *
   * @param {ZCFSeat} seat
   */
  const mintCharacterNFT = (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      want: { Asset: null },
    });
    const { want } = seat.getProposal();
    const newCharacterName = want.Asset.value[0].name;
    assert(nameIsUnique(newCharacterName), X`${errors.nameTaken}`);

    // Get random base character and merge with name input
    const newCharacter = {
      ...getRandomBaseCharacter(),
      name: newCharacterName,
    };

    const newCharacterAmount = AmountMath.make(
      characterBrand,
      harden([newCharacter]),
    );
    // Mint character to user seat
    characterMint.mintGains({ Asset: newCharacterAmount }, seat);

    // Mint items to inventory seat
    const allDefaultItems = Object.values(state.config.defaultItems);
    const itemsAmount = AmountMath.make(itemBrand, harden(allDefaultItems));
    const { zcfSeat: inventorySeat } = zcf.makeEmptySeatKit();
    itemMint.mintGains({ Items: itemsAmount }, inventorySeat);
    /**
     * @type {CharacterRecord}
     */
    const character = {
      name: newCharacter.name,
      character: newCharacter,
      inventory: inventorySeat,
    };
    state.characters = [...state.characters, character];
    seat.exit();

    return 'You minted an NFT!';
  };

  /**
   * Adds item to inventory
   *
   * @param {ZCFSeat} seat
   */
  const addToInventory = async (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      give: { Item: null },
    });
    const { give } = seat.getProposal();

    const characterSeat = state.characters[0].inventory;
    characterSeat.decrementBy(give);
    seat.incrementBy(give);
    zcf.reallocate(characterSeat, seat);

    seat.exit();
  };

  // Opportunity for more complex queries
  const getCharacters = () => {
    return harden({
      characters: state.characters,
    });
  };

  /**
   * Gets the inventory of a given character
   *
   * @param {string} characterName
   */
  const getCharacterInventory = (characterName) => {
    const characterRecord = state.characters.find(
      ({ character }) => character.name === characterName,
    );
    assert(characterRecord, X`${errors.character404}`);
    const { inventory } = characterRecord;
    const items = inventory.getAmountAllocated('Item', itemBrand);
    const all = inventory.getCurrentAllocation();
    return { items, all };
  };

  const creatorFacet = Far('Character store creator', {
    initConfig,
    getCharacterIssuer: () => characterIssuer,
    getItemIssuer: () => itemIssuer,
    getItemBrand: () => itemBrand,
    getCharacters,
    getConfig: () => state.config,
    setMintNext: (nextName) => {
      state.mintNext = nextName;
    },
    getMintNext: () => state.mintNext,
  });

  const publicFacet = Far('Chracter store public', {
    getConfig: () => state.config,
    getCharacterBase: () => state.config?.baseCharacters[0],
    getCharacters,
    getCharacterInventory,
    getCount: () => state.characterNames.length,
    getCharacterIssuer: () => characterIssuer,
    getCharacterBrand: () => characterBrand,
    getItemIssuer: () => itemIssuer,
    getItemBrand: () => itemBrand,
    getMintNext: () => state.mintNext,
    getNftConfig: () => ({ characterBrand, characterIssuer }),
    setMintNext: (nextName) => {
      state.mintNext = nextName;
    },
    getRandomBaseCharacter,
    getRandomItem,
    testPRNG: () => PRNG().toString(),
    addToInventory: () => zcf.makeInvitation(addToInventory, 'addToInventory'),
    mintCharacterNFT: () =>
      zcf.makeInvitation(mintCharacterNFT, 'mintCharacterNfts'),
    mintItemNFT: () => zcf.makeInvitation(mintItemNFT, 'mintItemNfts'),
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
