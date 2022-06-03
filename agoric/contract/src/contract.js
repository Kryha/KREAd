// @ts-check
import '@agoric/zoe/exported.js';
import { AssetKind, AmountMath, makeIssuerKit } from '@agoric/ertp';
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';
import { E } from '@endo/eventual-send';
import { FIRST_PRICE } from '@agoric/zoe/src/contracts/auction';

/**
 * This is a very simple contract that creates a new issuer and mints payments
 * from it, in order to give an example of how that can be done.  This contract
 * sends new tokens to anyone who has an invitation.
 *
 * The expectation is that most contracts that want to do something similar
 * would use the ability to mint new payments internally rather than sharing
 * that ability widely as this one does.
 *
 * To pay others in tokens, the creator of the instance can make
 * invitations for them, which when used to make an offer, will payout
 * the specified amount of tokens.
 *
 * @type {ContractStartFn}
 */
const start = async (zcf) => {
  // Create the internal token mint for a fungible digital asset. Note
  // that 'Tokens' is both the keyword and the allegedName.
  // const zcfMint = await zcf.makeZCFMint('Tokens');
  // AWAIT

  const zoeService = zcf.getZoeService();

  const characterSet = ['Tsun Tsun, Cmoney, Wietz, Popo'];
  const itemSet = {
    default: ['sombrero', 'mittens', 'shades', 'earwarmers'],
    all: ['nikes', 'sundress'],
  };

  // TODO: establish a rarity system set by the creator of the character set
  // const pickRandomCharacter = () => {
  //   const number = Math.random() * (characterSet.length - 1);
  //   return characterSet[number];
  // };

  const pickRandomItem = () => {
    const number = Math.random() * (itemSet.length - 1);
    return itemSet[number];
  };

  // Create the internal character nft issuer kit
  const {
    mint: characterMint,
    issuer: characterIssuer,
    brand: characterBrand,
  } = makeIssuerKit('CB', AssetKind.SET);

  // const characterMint = await zcf.makeZCFMint('CB', AssetKind.SET); // TODO: replace with more relevant name
  // const { issuer: characterIssuer, brand: characterBrand } =
  //   characterMint.getIssuerRecord();

  const itemMint = await zcf.makeZCFMint('CBI', AssetKind.SET); // TODO: replace with more relevant name
  const { issuer: itemIssuer, brand: itemBrand } = itemMint.getIssuerRecord();
  // const { mint: itemMint, issuer: itemIssuer, brand: itemBrand } = makeIssuerKit('CBI', AssetKind.SET);

  const characterRegistry = new Map();
  const characterItemInventory = new Map();

  // Now that ZCF has saved the issuer, brand, and local amountMath, they
  // can be accessed synchronously.
  // const { issuer, brand } = zcfMint.getIssuerRecord();

  // /** @type {OfferHandler} */
  // const mintItem = (seat) => {
  //   const amount = AmountMath.make(itemBrand, pickRandomItem());
  //   // Synchronously mint and allocate amount to seat.
  //   itemMint.mintGains(harden(amount), seat);
  //   // Exit the seat so that the user gets a payout.
  //   seat.exit();
  //   // Since the user is getting the payout through Zoe, we can
  //   // return anything here. Let's return some helpful instructions.
  //   return 'Offer completed. You should receive a payment from Zoe';
  // };

  const mintCharacters = async (
    characters,
    moneyIssuer,
    sellItemsInstallation,
    // auctionInstallation,
    // auctionItemsInstallation,
    // timeAuthority,
  ) => {
    const allCharacters = characters.map((character) => {
      // Check if name is unique
      const usedNames = [...characterRegistry.keys()];
      const nameIsUnique = !usedNames.includes(character.name);
      assert(
        nameIsUnique,
        X`Name ${character.name} is already in use, please select a different name`,
      );
      // Include base character in metadata
      // const number = Math.floor(Math.random() * (itemSet.length - 1));
      const characterBase = 'CHARACTER1';
      return {
        base: characterBase,
        ...character,
      };
    });

    const newCharactersAmount = AmountMath.make(
      characterBrand,
      harden(allCharacters),
    );

    const newcharactersPayment = characterMint.mintPayment(
      harden(newCharactersAmount),
    );

    const proposal = harden({
      give: { Items: newCharactersAmount },
    });
    const paymentKeywordRecord = harden({ Items: newcharactersPayment });

    const issuerKeywordRecord = harden({
      Items: characterIssuer,
      Money: moneyIssuer,
    });

    const pricePerItem = 1n;
    const sellItemsTerms = harden({
      pricePerItem,
    });
    // FIXME EProxy types, startInstance is any
    const instanceRecordP = E(zoeService).startInstance(
      sellItemsInstallation,
      issuerKeywordRecord,
      sellItemsTerms,
    );
    return instanceRecordP.then(
      ({ creatorInvitation, creatorFacet, instance, publicFacet }) => {
        assert(creatorInvitation);
        return E(zoeService)
          .offer(creatorInvitation, proposal, paymentKeywordRecord)
          .then((sellItemsCreatorSeat) => {
            return harden({
              sellItemsCreatorSeat,
              sellItemsCreatorFacet: creatorFacet,
              sellItemsInstance: instance,
              sellItemsPublicFacet: publicFacet,
            });
          });
      },
    );

  };

    /*
    assert(newCharactersAmount, X`Amount`);
    // Mint character & update registry

    // MINTGAINS
    // characterNFTMint.mintGains(harden({ cb: newCharacterAmount }), seat);
    const newcharactersPayment = characterMint.mintPayment(
      harden(newCharactersAmount),
    );

    for (const character of characters) {
      // Add character to internal registry
      characterRegistry.set(character.name, character);

      // Mint and equip default items
      // const itemPurse = itemIssuer.makeEmptyPurse();

      // const itemsAmount = AmountMath.make(itemBrand, itemSet.default);
      // const itemsPayment = itemMint.mintPayment(harden(itemsAmount));
      // itemPurse.deposit(itemsPayment);

      // // Add character to internal inventory registry
      // characterItemInventory.set(character.name, itemPurse);
    }
    // Exit the seat so that the user gets a payout.
    // seat.exit();

    // Creater sell instance
    const giveCharacterProposal = harden({
      give: { CB: newCharactersAmount },
    });
    const newCharacterPaymentKeywordRecord = harden({
      CB: newcharactersPayment,
    });
    const issuerKeywordRecord = harden({
      CB: characterIssuer,
      Money: moneyIssuer,
    });

    const auctionItemsTerms = harden({
      bidDuration: 1n,
      winnerPriceOption: FIRST_PRICE,
      ...zcf.getTerms(),
      auctionInstallation,
      minimalBid: 1,
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

    await E(zoeService).offer(
      creatorInvitation,
      giveCharacterProposal,
      newCharacterPaymentKeywordRecord,
    );

    return harden({
      auctionItemsCreatorFacet: creatorFacet,
      auctionItemsInstance: instance,
      auctionItemsPublicFacet: publicFacet,
    });
    // Deposit character into provided facet
    // characterDepositFacet.receive(newCharacterPayment);

    // return 'Offer completed. You should receive a payment from Zoe';
  };
  */
  const creatorFacet = Far('creatorFacet', {
    // The creator of the instance can send invitations to anyone
    // they wish to.
    mintCharacters,
    // makeInvitationMintCharacter: () =>
    //   zcf.makeInvitation(mintCharacter, 'mint a character'),
    // makeInvitationMintItem: () => zcf.makeInvitation(mintItem, 'mint an item'),
    getCharacterIssuer: () => characterIssuer,
    getItemIssuer: () => itemIssuer,
  });

  const publicFacet = Far('publicFacet', {
    // Make the token issuer public. Note that only the mint can
    // make new digital assets. The issuer is ok to make public.
    mintCharacters,
    getCharacterIssuer: () => characterIssuer,
    getItemIssuer: () => itemIssuer,
    // makeInvitationMintCharacter: () =>
    //   zcf.makeInvitation(mintCharacter, 'mint a character'),
    // makeInvitationMintItem: () => zcf.makeInvitation(mintItem, 'mint an item'),
  });

  // Return the creatorFacet to the creator, so they can make
  // invitations for others to get payments of tokens. Publish the
  // publicFacet.
  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
