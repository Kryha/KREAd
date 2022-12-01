// @ts-check
import '@endo/init/pre-bundle-source.js';

import { test } from '@agoric/zoe/tools/prepare-test-env-ava.js';
import { resolve as importMetaResolve } from 'import-meta-resolve';

import bundleSource from '@endo/bundle-source';

import { E } from '@endo/eventual-send';
import { makeFakeVatAdmin } from '@agoric/zoe/tools/fakeVatAdmin.js';
import { makeZoeKit } from '@agoric/zoe';
import { makeIssuerKit, AmountMath } from '@agoric/ertp';
import buildManualTimer from '@agoric/zoe/tools/manualTimer.js';

import { defaultCharacters } from './characters.js';
import { defaultItems } from './items.js';

const contractPath = new URL('../src/index.js', import.meta.url).pathname;

const setupKreadContract = async () => {
  const { zoeService } = makeZoeKit(makeFakeVatAdmin().admin);
  const feePurse = E(zoeService).makeFeePurse();
  const zoe = E(zoeService).bindDefaultFeePurse(feePurse);

  // pack the contract
  const bundle = await bundleSource(contractPath);

  // install the contract
  const installation = await E(zoe).install(bundle);

  const timer = buildManualTimer(console.log);

  return {
    zoe,
    installation,
    timer,
  };
};

test('zoe - create character and sell', async (t) => {
  t.plan(1);

  const { zoe, installation, timer } = await setupKreadContract();

  const { creatorFacet: kreadAdminFacet, publicFacet: kreadPublicFacet } =
    await E(zoe).startInstance(installation);

  const initConfigResponse = await E(kreadAdminFacet).initConfig({
    baseCharacters: defaultCharacters,
    defaultItems,
    timer,
  });
  console.log(initConfigResponse);

  const characterName = 'Wietze';
  const characterIssuer = await E(kreadPublicFacet).getCharacterIssuer();
  const characterBrand = await characterIssuer.getBrand();
  console.log(characterBrand);
  const makeCharacterAmount = (value) =>
    AmountMath.make(characterBrand, harden(value));

  // Character Amount to be minted
  const characterAmountToMint = makeCharacterAmount([{ name: characterName }]);

  // Get mint invitation
  const mintInvitation = await E(
    kreadPublicFacet,
  ).makeMintCharacterInvitation();

  const proposal = harden({
    want: { Asset: characterAmountToMint },
  });

  // timer ticks before offering, nothing happens
  timer.tick();

  // console.log(await E(kreadPublicFacet).getConfig());
  const seat = await E(zoe).offer(mintInvitation, proposal);
  console.log('🚨 SEAT:', seat);
  timer.tick();
  // console.log('ALLOCATION: ', seat.getCurrentAllocation());
  const payout = await E(seat).getPayout('Random');
  timer.tick();

  console.log(payout);
  const obtained = await E(characterIssuer).getAmountOf(payout);
  console.log('🚨 NFT:', obtained.value);

  console.log('🚨 CHARACTERS: ', await E(kreadPublicFacet).getCharacters());
  t.falsy(AmountMath.isEmpty(obtained), 'No character in seat');

  // Get sell invitation
  // const sellInvitation = await E(kreadPublicFacet).makeSellInvitation();

  // await E(auctionItemsCreatorSeat).getOfferResult();

  // const moneyPayment = await E(auctionItemsCreatorSeat).getPayout('Money');
  // const moneyEarned = await E(moolaIssuer).getAmountOf(moneyPayment);
  // t.deepEqual(moneyEarned, AmountMath.make(moolaBrand, 20n));

  // const cardInventory = await E(auctionItemsCreatorSeat).getPayout('Items');
  // const inventoryRemaining = await E(cardIssuer).getAmountOf(cardInventory);
  // t.deepEqual(inventoryRemaining, makeCardMath(['Alice']));
});
