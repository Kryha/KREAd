// @ts-check
import '@agoric/zoe/exported.js';
import { AssetKind, AmountMath } from '@agoric/ertp';
import { Far } from '@endo/marshal';
import { assert, details as X } from '@agoric/assert';

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
  const tokenName = 'CharacterB';
  const characterSet = ['Tsun Tsun, Cmoney, Wietz, Popo'];
  const itemSet = {
    default: ['sombrero', 'mittens', 'shades', 'earwarmers'],
    all: ['nikes', 'sundress'],
  };

  // TODO: establish a rarity system set by the creator of the character set
  const pickRandomCharacter = () => {
    const number = Math.random() * (characterSet.length - 1);
    return characterSet[number];
  };

  // Create the internal character nft issuer kit
  const characterNFTMint = await zcf.makeZCFMint(tokenName, AssetKind.SET); // TODO: replace with more relevant name
  const { issuer: characterIssuer, brand: characterBrand } =
    characterNFTMint.getIssuerRecord();

  const itemNFTMint = await zcf.makeZCFMint('Item', AssetKind.SET); // TODO: replace with more relevant name
  const { issuer: itemIssuer, brand: itemBrand } =
    itemNFTMint.getIssuerRecord();

  const characterRegistry = new Map();
  const characterItemInventory = new Map();

  // Now that ZCF has saved the issuer, brand, and local amountMath, they
  // can be accessed synchronously.
  // const { issuer, brand } = zcfMint.getIssuerRecord();

  /** @type {OfferHandler} */
  // const mintPayment = (seat) => {
  //   const amount = AmountMath.make(brand, 1000n);
  //   // Synchronously mint and allocate amount to seat.
  //   zcfMint.mintGains(harden({ Token: amount }), seat);
  //   // Exit the seat so that the user gets a payout.
  //   seat.exit();
  //   // Since the user is getting the payout through Zoe, we can
  //   // return anything here. Let's return some helpful instructions.
  //   return 'Offer completed. You should receive a payment from Zoe';
  // };

  /**
  //  * @param {object} newCharacterMetadata
   *
   * @param seat
   */
  const mintCharacter = async (seat) => {
    const newCharacterMetadata = { name: 'roberto' };
    // Check if name is unique
    const usedNames = [...characterRegistry.keys()];
    const nameAlreadyInUse = usedNames.includes(newCharacterMetadata.name);
    assert(
      nameAlreadyInUse,
      X`Name is already in use, please select a different name`,
    );
    // Include base character in metadata
    const characterMetadata = {
      characterBase: pickRandomCharacter(),
      ...newCharacterMetadata,
    };
    const newCharacterAmount = AmountMath.make(characterBrand, [
      characterMetadata,
    ]);
    // Mint character & update registry
    characterNFTMint.mintGains(newCharacterAmount);
    // const paymentKeywordRecord = harden({ Items: newCharacterPayment });
    characterRegistry.set(newCharacterMetadata.name, characterMetadata);

    // Mint and equip default items
    const itemPurse = itemIssuer.makeEmptyPurse();
    itemSet.default.forEach((item) => {
      const itemAmount = AmountMath.make(itemBrand, [item]);
      const itemPayment = itemNFTMint.mintPayment(itemAmount);
      itemPurse.deposit(itemPayment);
    });
    characterItemInventory.set(newCharacterMetadata.name, itemPurse);
    // Exit the seat so that the user gets a payout.
    seat.exit();

    // Deposit character into provided facet
    // characterDepositFacet.receive(newCharacterPayment);

    return 'Offer completed. You should receive a payment from Zoe';
  };
  const creatorFacet = Far('creatorFacet', {
    // The creator of the instance can send invitations to anyone
    // they wish to.
    makeInvitation: () => zcf.makeInvitation(mintCharacter, 'mint a character'),
    getCharacterIssuer: () => characterIssuer,
    getItemIssuer: () => itemIssuer,

  });

  const publicFacet = Far('publicFacet', {
    // Make the token issuer public. Note that only the mint can
    // make new digital assets. The issuer is ok to make public.
    getCharacterIssuer: () => characterIssuer,
    getItemIssuer: () => itemIssuer,
  });

  // Return the creatorFacet to the creator, so they can make
  // invitations for others to get payments of tokens. Publish the
  // publicFacet.
  return harden({ creatorFacet, publicFacet });
};

harden(start);
export { start };
