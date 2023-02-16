/* eslint-disable no-undef */
// @ts-check
import { assert, details as X } from '@agoric/assert';
import { AmountMath } from '@agoric/ertp';
import { errors } from './errors';
import {
  removeCharacterFromMarketArray,
  removeItemFromMarketArray,
} from './utils';

export const SELL_CHARACTER_DESCRIPTION = 'Sell Character in KREAd marketplace';
export const SELL_ITEM_DESCRIPTION = 'Sell Item in KREAd marketplace';

/**
 * Put character up for sale
 *
 * @param {ZCF} zcf
 * @param {()=>KreadState} getState
 */
export const market = (zcf, getState) => {
  const state = getState();

  /**
   * @type {CharacterMarketRecord[]}
   */
  let characterMarket = [];
  /**
   * @type {ItemMarketRecord[]}
   */
  let itemMarket = [];

  /**
   * Put character up for sale
   *
   * @param {ZCFSeat} sellerSeat
   */
  const sellCharacter = async (sellerSeat) => {
    assert(state.get.isReady(), X`${errors.noConfig}`);

    // Inspect allocation of Character keyword in seller seat
    const characterInSellSeat = sellerSeat.getAmountAllocated('Character');
    const { want } = sellerSeat.getProposal();
    const askingPrice = {
      brand: want.Price.brand,
      value: want.Price.value,
    };

    const character = characterInSellSeat.value[0];
    assert(character.name, X`${errors.character404}`);

    // Add to store array
    const newEntry = {
      sellerSeat,
      name: character.name,
      askingPrice,
      character,
    };

    characterMarket = [...characterMarket, newEntry];

    const {
      characters: { publisher },
    } = state.get.marketPublisher();

    assert(publisher, X`${errors.missingStorageNode}`);
    publisher.publish(characterMarket);

    return harden({ characterMarket, itemMarket });
  };

  /**
   * Put character up for sale
   *
   * @param {ZCFSeat} sellerSeat
   */
  const sellItem = async (sellerSeat) => {
    assert(state.get.isReady(), X`${errors.noConfig}`);

    // Inspect allocation of Character keyword in seller seat
    const itemInSellSeat = sellerSeat.getAmountAllocated('Item');
    const { want } = sellerSeat.getProposal();
    const askingPrice = {
      brand: want.Price.brand,
      value: want.Price.value,
    };
    const item = itemInSellSeat.value[0];

    // Add to store array
    const newEntry = {
      sellerSeat,
      id: item.id,
      askingPrice,
      item,
    };

    itemMarket = [...itemMarket, newEntry];

    const {
      items: { publisher },
    } = state.get.marketPublisher();

    assert(publisher, X`${errors.missingStorageNode}`);
    publisher.publish(itemMarket);

    return harden({ itemMarket });
  };

  /**
   *
   * @param {ZCFSeat} buyerSeat
   */
  const buyCharacter = async (buyerSeat) => {
    assert(state.get.isReady(), X`${errors.noConfig}`);

    const {
      character: { brand: characterBrand },
      paymentFT: { brand: paymentFTBrand },
    } = state.get.assetInfo();

    // Inspect Character keyword in buyer seat
    const { want, give } = buyerSeat.getProposal();
    const { Character: wantedCharacterAmount } = want;
    const character = wantedCharacterAmount.value[0];

    // Find characterRecord entry based on wanted character
    const characterRecord = state.get.character(character.name);
    assert(characterRecord, X`${errors.character404}`);

    // Find store record based on wanted character
    const sellRecord = characterMarket.find(
      (record) => record.name === character.name,
    );

    assert(sellRecord, X`${errors.character404}`);
    const sellerSeat = sellRecord.sellerSeat;

    // Inspect Price keyword from buyer seat
    const { Price: providedMoneyAmount } = give;
    const { Character: characterForSaleAmount } = sellerSeat.getProposal().give;
    assert(
      AmountMath.isEqual(
        wantedCharacterAmount,
        characterForSaleAmount,
        characterBrand,
      ),
      X`${errors.sellerSeatMismatch}`,
    );

    const { Price: characterForSalePrice } = sellerSeat.getProposal().want;
    assert(
      AmountMath.isGTE(
        providedMoneyAmount,
        characterForSalePrice,
        paymentFTBrand,
      ),
      X`${errors.insufficientFunds}`,
    );

    // Widthdraw Character from seller seat and deposit into buyer seat
    buyerSeat.incrementBy(
      sellerSeat.decrementBy({ Character: characterForSaleAmount }),
    );

    // Widthdraw price from buyer seat and deposit into seller seat
    sellerSeat.incrementBy(
      buyerSeat.decrementBy({ Price: providedMoneyAmount }),
    );

    zcf.reallocate(buyerSeat, sellerSeat);

    buyerSeat.exit();
    sellerSeat.exit();

    // Remove entry from store array
    characterMarket = removeCharacterFromMarketArray(
      characterMarket,
      sellRecord.name,
    );

    const {
      characters: { publisher },
    } = state.get.marketPublisher();

    assert(publisher, X`${errors.missingStorageNode}`);
    publisher.publish(characterMarket);

    return harden({ characterMarket });
  };

  /**
   *
   * @param {ZCFSeat} buyerSeat
   */
  const buyItem = async (buyerSeat) => {
    assert(state.get.isReady(), X`${errors.noConfig}`);

    const {
      item: { brand: itemBrand },
      paymentFT: { brand: paymentFTBrand },
    } = state.get.assetInfo();

    // Inspect Character keyword in buyer seat
    const { want, give } = buyerSeat.getProposal();
    const { Item: wantedItemAmount } = want;
    const item = wantedItemAmount.value[0];

    // Find store record based on wanted character
    const sellRecord = itemMarket.find((record) => record.id === item.id);
    assert(sellRecord, X`${errors.itemNotFound(item.id)}`);
    const sellerSeat = sellRecord.sellerSeat;

    // Inspect Price keyword from buyer seat
    const { Price: providedMoneyAmount } = give;
    const { Item: itemForSaleAmount } = sellerSeat.getProposal().give;
    assert(
      AmountMath.isEqual(wantedItemAmount, itemForSaleAmount, itemBrand),
      X`${errors.sellerSeatMismatch}`,
    );

    const { Price: itemForSalePrice } = sellerSeat.getProposal().want;
    assert(
      AmountMath.isGTE(providedMoneyAmount, itemForSalePrice, paymentFTBrand),
      X`${errors.insufficientFunds}`,
    );

    // Widthdraw Character from seller seat and deposit into buyer seat
    buyerSeat.incrementBy(sellerSeat.decrementBy({ Item: itemForSaleAmount }));

    // Widthdraw price from buyer seat and deposit into seller seat
    sellerSeat.incrementBy(
      buyerSeat.decrementBy({ Price: providedMoneyAmount }),
    );

    zcf.reallocate(buyerSeat, sellerSeat);

    buyerSeat.exit();
    sellerSeat.exit();
    itemMarket = removeItemFromMarketArray(itemMarket, sellRecord.id);

    const {
      items: { publisher },
    } = state.get.marketPublisher();

    assert(publisher, X`${errors.missingStorageNode}`);
    publisher.publish(itemMarket);

    return harden({ itemMarket });
  };

  return {
    makeSellCharacterInvitation: () =>
      zcf.makeInvitation(sellCharacter, SELL_CHARACTER_DESCRIPTION),
    makeBuyCharacterInvitation: () =>
      zcf.makeInvitation(buyCharacter, 'Buy Character in KREAd marketplace'),
    makeSellItemInvitation: () =>
      zcf.makeInvitation(sellItem, SELL_ITEM_DESCRIPTION),
    makeBuyItemInvitation: () =>
      zcf.makeInvitation(buyItem, 'Buy Item in KREAd marketplace'),
  };
};
