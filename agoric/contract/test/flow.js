import { errors } from "../src/errors.js";
import { text } from "./text.js"
import { defaultItems } from "./items.js"

const mintCharacter = {
  expected: {
    want: { name: "TestCharacterExpectedFlow" },
    message: text.characterMintSuccess,
  },
  duplicateName: {
    want: { name: "TestCharacterExpectedFlow" },
    message: errors.nameTaken("TestCharacterExpectedFlow")
  },
  noWantInOffer: {
    want: undefined,
    message: errors.noWantInOffer
  },
  noName: {
    want: { name: undefined },
    message: errors.noNameArg
  },
  extraProperties: {
    want: { name: "TestCharacter", bloodType: "blue", married: true },
    message: ""
  }
};

const mintItem = {
  expected: {
    want: defaultItems.hair,
    message: text.itemMintSuccess
  },
  multiple: {
    want: [defaultItems.airReservoir, defaultItems.background],
    message: text.itemMintSuccess
  },
}

const inventory = {
  characterName: "TestCharacterExpectedFlow",
  unequip: {
    message: text.unequipSuccess,
  },
  equip: {
    message: text.equipSuccess,
  },

}

const market = {
  bob: {
    give: {
      character: "TestCharacterExpectedFlow",
    },
    want: {
      item: "hair",
      payment: 20n
    },
  },
  alice: {
    give: {
      item: "hair",
      payment: 20n
    },
    want: {
      character: "TestCharacterExpectedFlow",
    },
  },
}

export const flow = {
  mintCharacter,
  mintItem,
  inventory,
  market
};