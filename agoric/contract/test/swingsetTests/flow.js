import { errors } from '../../src/kreadV2/errors.js';
import { text } from './text.js';
import { defaultItems } from './items.js';

const mintCharacter = {
  expected: {
    offerArgs: { name: 'TestCharacter' },
    give: { Price: 30000000n },
    message: text.characterMintSuccess,
  },
  feeTooLow: {
    offerArgs: { name: 'TestCharacterBadFlow' },
    give: { Price: 10000000n },
    message: errors.mintFeeTooLow,
  },
  duplicateName: {
    offerArgs: { name: 'TestCharacter' },
    give: { Price: 30000000n },
    message: errors.nameTaken('TestCharacter'),
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
  invalidName1: {
    offerArgs: { name: '012345678901234567890123' },
    give: { Price: 30000000n },
    message: errors.invalidName,
  },
  invalidName2: {
    offerArgs: { name: 'TestCharacter!' },
    give: { Price: 30000000n },
    message: errors.invalidName,
  },
  invalidName3: {
    offerArgs: { name: 'names' },
    give: { Price: 30000000n },
    message: errors.invalidName,
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
  characterName: 'TestCharacter',
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
      character: 'TestCharacter',
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
      character: 'TestCharacter',
    },
  },
};

export const flow = {
  mintCharacter,
  mintItem,
  inventory,
  market,
};
