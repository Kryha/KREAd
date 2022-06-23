// @ts-check
import '@agoric/zoe/exported';
import { makeIssuerKit, AssetKind, AmountMath } from '@agoric/ertp';
import {
  assertIssuerKeywords,
  satisfies,
  depositToSeat,
  swap,
} from '@agoric/zoe/src/contractSupport/index.js';
import { Far } from '@endo/marshal';
import { E } from '@endo/eventual-send';
import { assert, details as X } from '@agoric/assert';

import { FIRST_PRICE } from '@agoric/zoe/src/contracts/auction';
import { errors } from './errors';

/**
 * @typedef {{
 * characterNames: string[]
 * characters: CharacterRecord[]
 * config?: Config
 * mintNext: string
 * }} State
 * @typedef {{
 * moneyIssuer: Issuer
 * auctionInstallation: Installation
 * auctionItemsInstallation: Installation
 * timeAuthority: any
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
  const { issuer, mint, brand } = makeIssuerKit('Character', AssetKind.SET);
  const characterMint = await zcf.makeZCFMint('KCB', AssetKind.SET);
  const { issuer: characterIssuer, brand: characterBrand } =
    characterMint.getIssuerRecord();

  const zoeService = zcf.getZoeService();

  /**
   * Mutable contract state
   *
   * @type{State}
   */
  const state = {
    characterNames: [],
    characters: [],
    mintNext: 'PABLO',
  };

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
   * Set contract configuration, must be called befor most methods
   *
   * @param {Config} config
   * @returns {string}
   */
  const initConfig = ({
    moneyIssuer,
    auctionInstallation,
    auctionItemsInstallation,
    timeAuthority,
    baseCharacters,
  }) => {
    state.config = {
      moneyIssuer,
      auctionInstallation,
      auctionItemsInstallation,
      timeAuthority,
      baseCharacters,
      completed: true,
    };
    return 'Setup completed';
  };

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
   * Starting a transfer revokes the vault holder. The associated updater will
   * get a special notification that the vault is being transferred.
   *
   * @param {ZCFSeat} seat
   * @param {{
   * name: string
   * }} args
   */
  const createNewCharacterSeat = async (seat, args) => {
    const name = args.name;
    assert(state.config?.completed, X`${errors.noConfig}`);
    assert(args.name, X`${errors.noNameArg}`);
    assert(nameIsUnique(name), X`${errors.nameTaken}`);

    // const { want, give, exit } = seat.getProposal();

    assertIssuerKeywords(zcf, harden(['Asset', 'Price']));

    const newCharacter = {
      ...getRandomBaseCharacter(),
      name,
    };
    const newCharactersForSaleAmount = AmountMath.make(brand, [newCharacter]);
    const allCharactersForSalePayment = mint.mintPayment(
      newCharactersForSaleAmount,
    );

    const depositP = await depositToSeat(
      zcf,
      seat,
      { Asset: newCharactersForSaleAmount },
      { Asset: allCharactersForSalePayment },
    );
    assert(depositP, X`${errors.depositToSeatFailed}`);

    /**
     * @type {CharacterRecord}
     */
    const character = {
      name: newCharacter.name,
      character: newCharacter,
      seat,
    };
    state.characters = [...state.characters, character];
    seat.exit();
    return 'Offer Complete';
  };

  const createNewCharacter = async (name) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    const newCharacter = {
      ...getRandomBaseCharacter(),
      name,
    };

    const newCharactersForSaleAmount = AmountMath.make(brand, [newCharacter]);
    const allCharactersForSalePayment = mint.mintPayment(
      newCharactersForSaleAmount,
    );
    const proposal = harden({
      give: { Items: newCharactersForSaleAmount },
    });
    const paymentKeywordRecord = harden({ Items: allCharactersForSalePayment });

    const issuerKeywordRecord = harden({
      Items: issuer,
      Money: state.config.moneyIssuer,
    });
    // Adjust for 6 decimals
    const moneyValue = 10n ** 6n;
    const minBidPerCharacter = AmountMath.make(
      state.config.moneyIssuer.getBrand(),
      moneyValue,
    );
    // Terms used here are set via creatorFacet.initConfig(<config obj>)
    // Short bidDuration of 1s for [almost] instant sell
    const auctionItemsTerms = harden({
      bidDuration: 1n,
      winnerPriceOption: FIRST_PRICE,
      ...zcf.getTerms(),
      auctionInstallation: state.config.auctionInstallation,
      minimalBid: minBidPerCharacter,
      timeAuthority: state.config.timeAuthority,
    });

    const { creatorInvitation, instance, publicFacet } = await E(
      zoeService,
    ).startInstance(
      state.config.auctionItemsInstallation,
      issuerKeywordRecord,
      auctionItemsTerms,
    );

    const shouldBeInvitationMsg = `The auctionItemsContract instance should return a creatorInvitation`;
    assert(creatorInvitation, shouldBeInvitationMsg);

    const character = {
      name: newCharacter.name,
      character: newCharacter,
      auction: { instance, publicFacet },
    };
    state.characters = [...state.characters, character];

    await E(zoeService).offer(
      creatorInvitation,
      proposal,
      paymentKeywordRecord,
    );

    return harden({
      msg: 'Character mint successful, use attached public facet to purchase',
      auctionItemsPublicFacet: publicFacet,
    });
  };

  const auctionCharactersPublic = async (newCharacters, minBidPerCharacter) => {
    assert(state.config?.completed, X`${errors.noConfig}`);

    const newCharactersForSaleAmount = AmountMath.make(brand, newCharacters);
    const allCharactersForSalePayment = mint.mintPayment(
      newCharactersForSaleAmount,
    );
    const proposal = harden({
      give: { Items: newCharactersForSaleAmount },
    });
    const paymentKeywordRecord = harden({ Items: allCharactersForSalePayment });

    const issuerKeywordRecord = harden({
      Items: issuer,
      Money: state.config.moneyIssuer,
    });
    // Terms used here are set via creatorFacet.initConfig(<config obj>)
    // Short bidDuration of 1s for [almost] instant sell
    const auctionItemsTerms = harden({
      bidDuration: 1n,
      winnerPriceOption: FIRST_PRICE,
      ...zcf.getTerms(),
      auctionInstallation: state.config.auctionInstallation,
      minimalBid: minBidPerCharacter,
      timeAuthority: state.config.timeAuthority,
    });

    const { creatorInvitation, instance, publicFacet } = await E(
      zoeService,
    ).startInstance(
      state.config.auctionItemsInstallation,
      issuerKeywordRecord,
      auctionItemsTerms,
    );

    const shouldBeInvitationMsg = `The auctionItemsContract instance should return a creatorInvitation`;
    assert(creatorInvitation, shouldBeInvitationMsg);

    newCharacters.forEach((newCharacter) => {
      const character = {
        name: newCharacter.name,
        character: newCharacter,
        auction: { instance, publicFacet },
      };
      state.characters = [...state.characters, character];
    });

    await E(zoeService).offer(
      creatorInvitation,
      proposal,
      paymentKeywordRecord,
    );

    return harden({
      msg: 'Character mint successful, use attached public facet to purchase',
      auctionItemsPublicFacet: publicFacet,
    });
  };

  const auctionCharacters = async (
    newCharacters,
    moneyIssuer,
    auctionInstallation,
    auctionItemsInstallation,
    minBidPerCharacter,
    timeAuthority,
  ) => {
    const newCharactersForSaleAmount = AmountMath.make(brand, newCharacters);
    const allCharactersForSalePayment = mint.mintPayment(
      newCharactersForSaleAmount,
    );
    // Note that the proposal `want` is empty because we don't know
    // how many Characters will be sold, so we don't know how much money we
    // will make in total.
    // https://github.com/Agoric/agoric-sdk/issues/855
    const proposal = harden({
      give: { Items: newCharactersForSaleAmount },
    });
    const paymentKeywordRecord = harden({ Items: allCharactersForSalePayment });

    const issuerKeywordRecord = harden({
      Items: issuer,
      Money: moneyIssuer,
    });

    // Short bidDuration of 1s for [almost] instant sell
    const auctionItemsTerms = harden({
      bidDuration: 1n,
      winnerPriceOption: FIRST_PRICE,
      ...zcf.getTerms(),
      auctionInstallation,
      minimalBid: minBidPerCharacter,
      timeAuthority,
    });

    const { creatorInvitation, creatorFacet, instance, publicFacet } = await E(
      zoeService,
    ).startInstance(
      auctionItemsInstallation,
      issuerKeywordRecord,
      auctionItemsTerms,
    );

    const shouldBeInvitationMsg = `The auctionItemsContract instance should return a creatorInvitation`;
    assert(creatorInvitation, shouldBeInvitationMsg);

    newCharacters.forEach((newCharacter) => {
      const character = {
        name: newCharacter.name,
        character: newCharacter,
        auction: { instance, publicFacet },
      };
      state.characters = [...state.characters, character];
      // characterArray.push(character);
      // characterList.set(newCharacter.name, {
      //   character: newCharacter,
      //   auction: instance,
      // });
    });

    await E(zoeService).offer(
      creatorInvitation,
      proposal,
      paymentKeywordRecord,
    );
    return harden({
      auctionItemsCreatorFacet: creatorFacet,
      auctionItemsInstance: instance,
      auctionItemsPublicFacet: publicFacet,
    });
  };

  // Opportunity for more complex queries
  const getCharacters = () => {
    return harden({
      characters: state.characters,
    });
  };
  const creatorFacet = Far('Character store creator', {
    auctionCharacters,
    auctionCharactersPublic,
    // mintCharacter: () =>
    //   zcf.makeInvitation(
    //     mintCharacterZCF,
    //     'mint a character nft via mintGains',
    //   ),
    getIssuer: () => issuer,
    getCharacterIssuer: () => characterIssuer,
    getCharacters,
    setMintNext: (nextName) => {
      state.mintNext = nextName;
    },
    getMintNext: () => state.mintNext,
    getConfig: () => state.config,
    initConfig,
  });

  const publicFacet = Far('Chracter store public', {
    getIssuer: () => issuer,
    getCharacterIssuer: () => characterIssuer,
    setMintNext: (nextName) => {
      state.mintNext = nextName;
    },
    getMintNext: () => state.mintNext,
    // mintCharacter: () =>
    //   zcf.makeInvitation(
    //     mintCharacterZCF,
    //     'mint a character nft via mintGains',
    //   ),
    getCharacters,
    getCharacterArray: () => state.characters,
    getCharacterNames: () => state.characterNames,
    auctionCharactersPublic,
    createNewCharacter,
    createNewCharacterSeat: (args) =>
      zcf.makeInvitation(
        createNewCharacterSeat,
        'createNewCharacterSeat',
        args,
      ),
    getCount: () => state.characterNames.length,
    getConfig: () => state.config,
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
