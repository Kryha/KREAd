// @ts-check
import '@agoric/zoe/exported';
import { makeIssuerKit, AssetKind, AmountMath } from '@agoric/ertp';
import {
  assertIssuerKeywords,
  satisfies,
  depositToSeat,
  swap,
  assertProposalShape,
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
   * @type {State}
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
   * Mints a new character to a depositFacet
   *
   * @param {ZCFSeat} seat
   * @param {{name: string}} args
   */
  const mintNFTsArgs = (seat, args) => {
    const { name } = args;
    assert(state.config?.completed, X`${errors.noConfig}`);
    assert(name, X`${errors.noNameArg}`);
    assert(nameIsUnique(name), X`${errors.nameTaken}`);
    assertProposalShape(seat, {
      want: { Asset: null },
      give: { Price: null },
    });

    const { want, give } = seat.getProposal();

    if (
      AmountMath.isGTE(
        AmountMath.make(state.config?.moneyIssuer.getBrand(), 10n),
        give.Tokens,
      )
    ) {
      seat.fail(new Error('Your offer is not good enough'));
      return 'Your offer is not good enough';
    }
    const { zcfSeat: nftSeat } = zcf.makeEmptySeatKit();
    characterMint.mintGains(want, nftSeat);

    nftSeat.incrementBy(give);
    nftSeat.decrementBy(want);
    seat.incrementBy(want);
    seat.decrementBy(give);
    zcf.reallocate(nftSeat, seat);

    seat.exit();

    return 'You minted an NFT!';
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
    characterMint.mintGains(want, seat);
    seat.exit();

    return 'You minted an NFT!';
  };

  // TODO: The following functions are here to test various
  //       patterns and functionality, they are not used.
  //       let's remove once we finalize the architecture

  /**
   * Mints a new character to a depositFacet
   *
   * @param {DepositFacet} user
   * @param {string} name
   */
  const mintCharacterViaFacet = (user, name) => {
    assert(state.config?.completed, X`${errors.noConfig}`);
    assert(name, X`${errors.noNameArg}`);
    assert(nameIsUnique(name), X`${errors.nameTaken}`);

    // const { want, give, exit } = seat.getProposal();

    const newCharacter = {
      ...state.config.baseCharacters[0],
      name,
    };
    const newCharactersForSaleAmount = AmountMath.make(
      brand,
      harden([newCharacter]),
    );
    const newCharacterPayment = mint.mintPayment(
      harden(newCharactersForSaleAmount),
    );

    const depositP = user.receive(newCharacterPayment);
    assert(depositP, X`${errors.depositToFacetFailed}`);

    /**
     * @type {CharacterRecord}
     */
    const character = {
      name: newCharacter.name,
      character: newCharacter,
    };
    state.characters = [...state.characters, character];
    return 'Offer Complete';
  };
  /**
   * Mints a new character
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

  const { zcfSeat: nftSeat } = zcf.makeEmptySeatKit();

  const createNewCharacterSeatDeterministic = async (seat, args) => {
    const name = args.name;
    assert(state.config?.completed, X`${errors.noConfig}`);
    assert(args.name, X`${errors.noNameArg}`);
    assert(nameIsUnique(name), X`${errors.nameTaken}`);

    assertProposalShape(seat, {
      want: {
        Asset: null,
      },
    });
    const { want, give, exit } = seat.getProposal();

    // assertIssuerKeywords(zcf, harden(['Asset', 'Price']));

    const newCharacter = {
      ...state.config.baseCharacters[0],
      name,
    };
    const newCharactersForSaleAmount = AmountMath.make(brand, [newCharacter]);
    const allCharactersForSalePayment = mint.mintPayment(
      newCharactersForSaleAmount,
    );

    const depositP = await depositToSeat(
      zcf,
      nftSeat,
      { Asset: newCharactersForSaleAmount },
      { Asset: allCharactersForSalePayment },
    );

    nftSeat.incrementBy(give);
    nftSeat.decrementBy(want);
    seat.incrementBy(want);
    seat.decrementBy(give);
    zcf.reallocate(nftSeat, seat);
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

  const createNextCharacterSeat = async (seat) => {
    const name = state.mintNext;
    assert(state.config?.completed, X`${errors.noConfig}`);
    assert(nameIsUnique(name), X`${errors.nameTaken}`);

    assertProposalShape(seat, {
      want: {
        Asset: null,
      },
    });
    const { want } = seat.getProposal();

    // assertIssuerKeywords(zcf, harden(['Asset', 'Price']));

    const newCharacter = {
      ...state.config.baseCharacters[0],
      name,
    };
    const newCharactersForSaleAmount = AmountMath.make(
      brand,
      harden([newCharacter]),
    );
    const allCharactersForSalePayment = mint.mintPayment(
      harden(newCharactersForSaleAmount),
    );

    const depositP = await depositToSeat(
      zcf,
      nftSeat,
      { Asset: newCharactersForSaleAmount },
      { Asset: allCharactersForSalePayment },
    );

    nftSeat.decrementBy(want);
    seat.incrementBy(want);
    zcf.reallocate(nftSeat, seat);
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

  // FIXME: END OF TESTING FUNCTIONS 👆

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

    // The following are related to the testing fns above and are currently unused
    auctionCharacters,
    auctionCharactersPublic,
    setMintNext: (nextName) => {
      state.mintNext = nextName;
    },
    getMintNext: () => state.mintNext,
    getIssuer: () => issuer, // This returns the character issuer from the makeIssuerKit function
  });

  const publicFacet = Far('Chracter store public', {
    getCharacters,
    getCharacterIssuer: () => characterIssuer,
    getCharacterBrand: () => brand,
    mintNFTs: () => zcf.makeInvitation(mintNFTs, 'mintNfts'),
    getKCB: () => ({ characterBrand, characterIssuer }),
    getConfig: () => state.config,
    getCharacterBase: () => state.config?.baseCharacters[0],
    getCount: () => state.characterNames.length,

    // The following are related to the testing fns above and are currently unused
    getIssuer: () => issuer,
    setMintNext: (nextName) => {
      state.mintNext = nextName;
    },
    getMintNext: () => state.mintNext,
    getCharacterArray: () => state.characters,
    getCharacterNames: () => state.characterNames,
    auctionCharactersPublic,
    createNewCharacter,
    mintCharacterViaFacet,
    mintNFTsArgs: (args) => zcf.makeInvitation(mintNFTsArgs, 'mintNfts', args),
    createNextCharacter: () =>
      zcf.makeInvitation(createNextCharacterSeat, 'createNextCharacterSeat'),
    createNewCharacterSeat: (args) =>
      zcf.makeInvitation(
        createNewCharacterSeat,
        'createNewCharacterSeat',
        args,
      ),
    createNewCharacterSeatDeterministic: (args) =>
      zcf.makeInvitation(
        createNewCharacterSeatDeterministic,
        'createNewCharacterSeat',
        args,
      ),
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
