/* eslint-disable no-undef */
// @ts-check
import { assert, details as X } from '@agoric/assert';
import { AmountMath } from '@agoric/ertp';
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js';
import { makeNotifierKit } from '@agoric/notifier';
import { errors } from './errors';
import * as state from './get';
import {
  removeCharacterFromMarketArray,
  removeItemFromMarketArray,
} from './utils';

/**
 * Put character up for sale
 *
 * @param {ZCF} zcf
 * @param {State} STATE
 * @param STATE
 */
export const market = (zcf, STATE) => {
  /**
   * @type {CharacterMarketRecord[]}
   */
  let characterMarket = [];
  /**
   * @type {ItemMarketRecord[]}
   */
  let itemMarket = [];

  // Set up notifiers
  const { notifier: characterShopNotifier, updater: characterShopUpdater } =
    makeNotifierKit();
  const { notifier: itemShopNotifier, updater: itemShopUpdater } =
    makeNotifierKit();

  const {
    assets: {
      character: { brand: characterBrand },
      item: { brand: itemBrand },
      token: { brand: tokenBrand },
    },
  } = STATE;
  /**
   * Put character up for sale
   *
   * @param {ZCFSeat} sellerSeat
   */
  const sellCharacter = async (sellerSeat) => {
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(sellerSeat, {
      give: {
        Character: null,
      },
      want: {
        Price: null,
      },
    });
    // Inspect allocation of Character keyword in seller seat
    const characterInSellSeat = sellerSeat.getAmountAllocated('Character');
    const { want } = sellerSeat.getProposal();
    const askingPrice = {
      brand: want.Price.brand,
      value: want.Price.value,
    };

    const character = characterInSellSeat.value[0];
    assert(
      character.name,
      `No character name found in seller seat. Character asset brand ${characterInSellSeat.brand} asset`,
    );

    // Add to store array
    const newEntry = {
      sellerSeat,
      name: character.name,
      askingPrice,
      character,
    };

    characterMarket = [...characterMarket, newEntry];
    characterShopUpdater.updateState(characterMarket);
    return harden({ characterMarket });
  };

  /**
   * Put character up for sale
   *
   * @param {ZCFSeat} sellerSeat
   */
  const sellItem = async (sellerSeat) => {
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(sellerSeat, {
      give: {
        Item: null,
      },
      want: {
        Price: null,
      },
    });
    // Inspect allocation of Character keyword in seller seat
    const itemInSellSeat = sellerSeat.getAmountAllocated('Item');
    const { want } = sellerSeat.getProposal();
    const askingPrice = {
      brand: want.Price.brand,
      value: want.Price.value,
    };
    const item = itemInSellSeat.value[0];
    assert(
      item.id,
      `No character name found in seller seat. Character asset brand ${itemInSellSeat.brand} asset`,
    );

    // Add to store array
    const newEntry = {
      sellerSeat,
      id: item.id,
      askingPrice,
      item,
    };

    itemMarket = [...itemMarket, newEntry];

    itemShopUpdater.updateState(itemMarket);

    return harden({ itemMarket });
  };

  /**
   *
   * @param {ZCFSeat} buyerSeat
   */
  const buyCharacter = async (buyerSeat) => {
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(buyerSeat, {
      give: {
        Price: null,
      },
      want: {
        Character: null,
      },
    });

    // Inspect Character keyword in buyer seat
    const { want, give } = buyerSeat.getProposal();
    const { Character: wantedCharacterAmount } = want;
    const character = wantedCharacterAmount.value[0];
    // Find characterRecord entry based on wanted character
    const characterRecord = state.getCharacterRecord(character.name, STATE);
    assert(
      characterRecord,
      `Couldn't find character record for ${character.name}`,
    );
    // Find store record based on wanted character
    const sellRecord = characterMarket.find(
      (record) => record.name === character.name,
    );
    assert(sellRecord, `Couldn't find character record for ${character.name}`);
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
      'Wanted Character amount does not match character in sellerSeat',
    );

    const { Price: characterForSalePrice } = sellerSeat.getProposal().want;
    assert(
      AmountMath.isGTE(providedMoneyAmount, characterForSalePrice, tokenBrand),
      'Provided payment is lower than the asking price for this Character',
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
    characterShopUpdater.updateState(characterMarket);

    return harden({ characterMarket });
  };

  /**
   *
   * @param {ZCFSeat} buyerSeat
   */
  const buyItem = async (buyerSeat) => {
    assert(STATE.config?.completed, X`${errors.noConfig}`);
    assertProposalShape(buyerSeat, {
      give: {
        Price: null,
      },
      want: {
        Item: null,
      },
    });

    // Inspect Character keyword in buyer seat
    const { want, give } = buyerSeat.getProposal();
    const { Item: wantedItemAmount } = want;
    const item = wantedItemAmount.value[0];

    // Find store record based on wanted character
    const sellRecord = itemMarket.find((record) => record.id === item.id);
    assert(sellRecord, `Couldn't find item record for ${item.id}`);
    const sellerSeat = sellRecord.sellerSeat;

    // Inspect Price keyword from buyer seat
    const { Price: providedMoneyAmount } = give;
    const { Item: itemForSaleAmount } = sellerSeat.getProposal().give;
    assert(
      AmountMath.isEqual(wantedItemAmount, itemForSaleAmount, itemBrand),
      'Wanted Item amount does not match item in sellerSeat',
    );

    const { Price: itemForSalePrice } = sellerSeat.getProposal().want;
    assert(
      AmountMath.isGTE(providedMoneyAmount, itemForSalePrice, tokenBrand),
      'Provided payment is lower than the asking price for this Item',
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
    itemShopUpdater.updateState(itemMarket);
    return harden({ itemMarket });
  };

  return {
    makeSellCharacterInvitation: () =>
      zcf.makeInvitation(sellCharacter, 'Sell Character in KREAd marketplace'),
    makeBuyCharacterInvitation: () =>
      zcf.makeInvitation(buyCharacter, 'Buy Character in KREAd marketplace'),
    makeSellItemInvitation: () =>
      zcf.makeInvitation(sellItem, 'Sell Item in KREAd marketplace'),
    makeBuyItemInvitation: () =>
      zcf.makeInvitation(buyItem, 'Buy Item in KREAd marketplace'),
    getCharacterShopNotifier: () => characterShopNotifier,
    getItemShopNotifier: () => itemShopNotifier,
  };
};
