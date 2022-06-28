// @ts-check
import '@agoric/zoe/exported';
import { AssetKind } from '@agoric/ertp';
import {
  satisfies,
  assertProposalShape,
} from '@agoric/zoe/src/contractSupport/index.js';
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';
import { errors } from './errors';

/**
 * @typedef {{
 * characterNames: string[]
 * characters: CharacterRecord[]
 * config?: Config
 * mintNext: string
 * }} State
 * @typedef {{
 * baseCharacters: object[]
 * completed?: boolean
 * }} Config
 * @typedef {{
 * name: string
 * character: object
 * seat?: ZCFSeat
 * auction?: {
 *   instance: Instance,
 *   publicFacet: any,
 * },
 * }} CharacterRecord
 */

/**
 * This contract mints non-fungible tokens (Characters) and creates a contract
 * instance to auction the Characters in exchange for some sort of money.
 *
 * @type {ContractStartFn}
 */
const start = async (zcf) => {
  // Define Assets
  const characterMint = await zcf.makeZCFMint('KCB', AssetKind.SET);
  const { issuer: characterIssuer, brand: characterBrand } =
    characterMint.getIssuerRecord();

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
   * @param {Config} config
   * @returns {string}
   */
  const initConfig = ({ baseCharacters }) => {
    state.config = {
      baseCharacters,
      completed: true,
    };
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
   *
   * @returns {any}
   */
  const getRandomBaseCharacter = () => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    const number = Math.random() * (state.config.baseCharacters.length - 1);
    return state.config.baseCharacters[number];
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
  const mintNFTs = (seat) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(seat, {
      want: { Asset: null },
    });
    const { want } = seat.getProposal();
    const newCharacter = want.Asset.value[0];
    characterMint.mintGains(want, seat);
    /**
     * @type {CharacterRecord}
     */
    const character = {
      name: newCharacter.name,
      character: newCharacter,
    };
    state.characters = [...state.characters, character];
    seat.exit();

    return 'You minted an NFT!';
  };

  // Opportunity for more complex queries
  const getCharacters = () => {
    return harden({
      characters: state.characters,
    });
  };

  const creatorFacet = Far('Character store creator', {
    initConfig,
    getCharacterIssuer: () => characterIssuer,
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
    getCount: () => state.characterNames.length,
    getCharacterIssuer: () => characterIssuer,
    getCharacterBrand: () => characterBrand,
    getMintNext: () => state.mintNext,
    getNftConfig: () => ({ characterBrand, characterIssuer }),
    setMintNext: (nextName) => {
      state.mintNext = nextName;
    },
    mintNFTs: () => zcf.makeInvitation(mintNFTs, 'mintNfts'),
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
