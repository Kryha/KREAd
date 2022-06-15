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
const start = (zcf) => {
  // Create the internal character mint
  // eslint-disable-next-line prettier/prettier
  const { issuer, mint, brand } = makeIssuerKit(
    'character',
    AssetKind.SET,
  );

  // const characterMint = zcf.makeZCFMint('CHARACTER', AssetKind.SET);
  // const { issuer: characterIssuer, brand: characterBrand } =
  //   characterMint.getIssuerRecord();

  const zoeService = zcf.getZoeService();

  const characterList = new Map();
  const characterArray = [];

  // const mintCharacter = (seat) => {
  //   const amount = AmountMath.make(
  //     characterBrand,
  //     harden([
  //       {
  //         name: 'Pablo',
  //         url: 'https://ca.slack-edge.com/T4P05TL1F-UGXFGC8F2-ff1dfa5543f9-512',
  //       },
  //     ]),
  //   );
  //   // Synchronously mint and allocate amount to seat.
  //   characterMint.mintGains(harden(amount), seat);
  //   // Exit the seat so that the user gets a payout.
  //   seat.exit();
  //   // Since the user is getting the payout through Zoe, we can
  //   // return anything here. Let's return some helpful instructions.
  //   return 'Offer completed. You should receive a payment from Zoe';
  // };

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

    // CODECHANGE2: shortened bidDuration from 300 to 1s for quicker testing
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
        auction: instance,
      };
      characterArray.push(character);
      characterList.set(newCharacter.name, {
        character: newCharacter,
        auction: instance,
      });
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

  const getNfts = () => {
    const nfts = characterList.values();
    return harden({
      nfts,
    });
  };
  const getCharacters = () => {
    return harden({
      characters: characterArray,
    });
  };
  const creatorFacet = Far('Character store creator', {
    auctionCharacters,
    // mintCharacter: zcf.makeInvitation(mintCharacter, 'mint a character nft'),
    getIssuer: () => issuer,
    // getCharacterIssuer: () => characterIssuer,
    getNfts,
    getCharacters,
  });

  const publicFacet = Far('Chracter store public', {
    getIssuer: () => issuer,
    // getCharacterIssuer: () => characterIssuer,
    // mintCharacter: zcf.makeInvitation(mintCharacter, 'mint a character nft'),
    getNfts,
    getCharacters,
    auctionCharacters,
  });

  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
