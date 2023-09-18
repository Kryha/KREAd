import { errors } from '../src/errors.js';
import { text } from './text.js';
import { defaultItems } from './items.js';

const mintCharacter = {
  expected: {
    offerArgs: { name: 'TestCharacterExpectedFlow' },
    give: { Price: 30000000n },
    message: text.characterMintSuccess,
  },
  feeTooLow: {
    offerArgs: { name: 'TestCharacterBadFlow' },
    give: { Price: 10000000n },
    message: errors.mintFeeTooLow,
  },
  duplicateName: {
    offerArgs: { name: 'TestCharacterExpectedFlow' },
    give: { Price: 30000000n },
    message: errors.nameTaken('TestCharacterExpectedFlow'),
  },
  noArgs: {
    offerArgs: undefined,
    give: { Price: 30000000n },
    message: errors.noNameArg,
  },
  noName: {
    offerArgs: { name: undefined },
    give: { Price: 30000000n },
    message: errors.noNameArg,
  },
  noAvailability: {
    offerArgs: { name: 'TestCharacterBadFlow' },
    give: { Price: 30000000n },
    message: errors.allMinted,
  },
  extraProperties: {
    offerArgs: { name: 'TestCharacter', bloodType: 'blue', married: true },
    give: { Price: 30000000n },
    message: '',
  },
};

const mintItem = {
  expected: {
    want: defaultItems.filter(({ rarity }) => rarity > 59)[0],
    message: text.itemMintSuccess,
  },
  multiple: {
    want: defaultItems.filter(({ rarity }) => rarity < 20)[0],
    message: text.itemMintSuccess,
  },
  multipleUnique: {
    want: [
      defaultItems.filter(({ rarity }) => rarity > 39 && rarity < 60)[0],
      defaultItems.filter(({ rarity }) => rarity > 19 && rarity < 40)[0],
    ],
    message: text.itemMintSuccess,
  },
};

const inventory = {
  characterName: 'TestCharacterExpectedFlow',
  unequip: {
    message: text.unequipSuccess,
  },
  equip: {
    message: text.equipSuccess,
  },
};

const market = {
  bob: {
    give: {
      character: 'TestCharacterExpectedFlow',
    },
    want: {
      item: 'hair',
      payment: 20n,
    },
  },
  alice: {
    give: {
      item: 'hair',
      payment: 20n,
    },
    want: {
      character: 'TestCharacterExpectedFlow',
    },
  },
};

export const flow = {
  mintCharacter,
  mintItem,
  inventory,
  market,
};
