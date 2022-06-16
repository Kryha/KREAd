// @ts-check
import '@agoric/zoe/exported';

import { makeIssuerKit, AssetKind, AmountMath } from '@agoric/ertp';
import { Far } from '@endo/marshal';
import { E } from '@endo/eventual-send';

import { FIRST_PRICE } from '@agoric/zoe/src/contracts/auction';

/**
 * This contract mints non-fungible tokens (Characters) and creates a contract
 * instance to auction the Characters in exchange for some sort of money.
 *
 * @type {ContractStartFn}
 */
const start = async (zcf) => {
  // Create the internal character mint
  const { issuer, mint, brand } = makeIssuerKit('Character', AssetKind.SET);

  const characterMint = await zcf.makeZCFMint('KCB', AssetKind.SET);
  const { issuer: characterIssuer, brand: characterBrand } =
    characterMint.getIssuerRecord();

  const zoeService = zcf.getZoeService();

  // const characterList = new Map();
  let characterArray = [];
  let config = {
    completed: false,
  };
  let counter = 1;

  // TODO: establish a rarity system set by the creator of the character set
  // const pickRandomCharacter = () => {
  //   const number = Math.random() * (characterSet.length - 1);
  //   return characterSet[number];
  // };
  const mintCharacterZCF = (seat) => {
    const amount = AmountMath.make(
      characterBrand,
      harden([
        {
          name: `Pablo${counter}`,
          url: 'https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512',
        },
      ]),
    );

    // Synchronously mint and allocate amount to seat.
    characterMint.mintGains(harden(amount), seat);
    // Exit the seat so that the user gets a payout.
    seat.exit();

    characterArray = [
      ...characterArray,
      {
        name: `Pablo${counter}`,
        url: 'https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512',
      },
    ];
    counter += 1;
    // Since the user is getting the payout through Zoe, we can
    // return anything here. Let's return some helpful instructions.
    return 'Offer completed. You should receive a payment from Zoe';
  };

  const initConfig = (
    moneyIssuer,
    auctionInstallation,
    auctionItemsInstallation,
    timeAuthority,
    baseCharacters,
  ) => {
    config = {
      moneyIssuer,
      auctionInstallation,
      auctionItemsInstallation,
      timeAuthority,
      baseCharacters,
      completed: true,
    };
    return 'Setup completed';
  };

  // TODO: establish a rarity system set by the creator of the character set
  const getRandomBaseCharacter = () => {
    const number = Math.random() * (config.baseCharacters.length - 1);
    return config.baseCharacters[number];
  };

  const createNewCharacter = async (name) => {
    assert(
      config.completed,
      'Configuration not found, please use creatorFacet.initConfig(<config>) to enable this method',
    );
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
      Money: config.moneyIssuer,
    });
    // Adjust for 6 decimals
    const moneyValue = 10n ** 6n;
    const minBidPerCharacter = AmountMath.make(config.moneyBrand, moneyValue);
    // Terms used here are set via creatorFacet.initConfig(<config obj>)
    // Short bidDuration of 1s for [almost] instant sell
    const auctionItemsTerms = harden({
      bidDuration: 1n,
      winnerPriceOption: FIRST_PRICE,
      ...zcf.getTerms(),
      auctionInstallation: config.auctionInstallation,
      minimalBid: minBidPerCharacter,
      timeAuthority: config.timeAuthority,
    });

    const { creatorInvitation, instance, publicFacet } = await E(
      zoeService,
    ).startInstance(
      config.auctionItemsInstallation,
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
    characterArray = [...characterArray, character];

    await E(zoeService).offer(
      creatorInvitation,
      proposal,
      paymentKeywordRecord,
    );

    counter += 1;

    return harden({
      msg: 'Character mint successful, use attached public facet to purchase',
      auctionItemsPublicFacet: publicFacet,
    });
  };

  const auctionCharactersPublic = async (newCharacters, minBidPerCharacter) => {
    assert(
      config.completed,
      'Configuration not found, please use creatorFacet.initConfig(<config>) to enable this method',
    );
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
      Money: config.moneyIssuer,
    });
    // Terms used here are set via creatorFacet.initConfig(<config obj>)
    // Short bidDuration of 1s for [almost] instant sell
    const auctionItemsTerms = harden({
      bidDuration: 1n,
      winnerPriceOption: FIRST_PRICE,
      ...zcf.getTerms(),
      auctionInstallation: config.auctionInstallation,
      minimalBid: minBidPerCharacter,
      timeAuthority: config.timeAuthority,
    });

    const { creatorInvitation, instance, publicFacet } = await E(
      zoeService,
    ).startInstance(
      config.auctionItemsInstallation,
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
      characterArray = [...characterArray, character];
    });

    await E(zoeService).offer(
      creatorInvitation,
      proposal,
      paymentKeywordRecord,
    );

    counter += 1;

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
      characterArray = [...characterArray, character];
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
      characters: characterArray,
    });
  };
  const creatorFacet = Far('Character store creator', {
    auctionCharacters,
    auctionCharactersPublic,
    mintCharacter: () =>
      zcf.makeInvitation(
        mintCharacterZCF,
        'mint a character nft via mintGains',
      ),
    getIssuer: () => issuer,
    getCharacterIssuer: () => characterIssuer,
    getCharacters,
    getConfig: () => config,
    initConfig,
  });

  const publicFacet = Far('Chracter store public', {
    getIssuer: () => issuer,
    getCharacterIssuer: () => characterIssuer,
    mintCharacter: () =>
      zcf.makeInvitation(
        mintCharacterZCF,
        'mint a character nft via mintGains',
      ),
    getCharacters,
    getCharacterArray: () => characterArray,
    auctionCharactersPublic,
    createNewCharacter,
    getCount: () => counter,
    getConfig: () => config,
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
