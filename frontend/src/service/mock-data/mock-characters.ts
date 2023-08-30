import { Character, CharacterInMarket } from "../../interfaces";
import { Lina } from "../../assets/images/items";
import { mockCharacterItems } from "./mock-items";

export const mockCharacters: Character[] = [
  {
    title: "Lina Character",
    image: Lina.character,
    keyId: 1,
    name: "Lina Character",
    type: "tempetScavenger",
    id: "7999",
    description:
      "A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.",
    level: 1,
    detail: {
      boardId: "06553",
      brand: "0x0177812bsjs7998",
      artist: "emily",
      metadata: "https://yourmetadata.info",
    },
    projectDescription: "this is a project",
    itemActivity: [
      {
        name: "transfer",
        to: "0x0177812bsjs7998",
        from: "0x0177812bsjs7998",
        date: 1235667272,
      },
    ],
  },
  {
    title: "Tempet Character",
    image: Lina.character,
    keyId: 2,
    name: "Tempet Character",
    type: "tempetScavenger",
    id: "78991",
    description:
      "A Tempet Scavenger has Tempet technology, which is, own modification on the standard requirements and regulations on tech that is allowed. Agreed among the cities. Minimal and elegant, showcasing their water technology filtration system that is known throughout that land as having the best mask when it comes to scent tracking technology.",
    level: 2,
    detail: {
      boardId: "06553",
      brand: "0x0177812bsjs7998",
      artist: "emily",
      metadata: "https://yourmetadata.info",
    },
    projectDescription: "this is a project",
    itemActivity: [
      {
        name: "transfer",
        to: "0x0177812bsjs7998",
        from: "0x0177812bsjs7998",
        date: 1235667272,
      },
    ],
  },
];

export const mockCharactersInMarket: CharacterInMarket[] = [
  {
    id: "1",
    character: mockCharacters[0],
    equippedItems: mockCharacterItems,
    sell: {
      publicFacet: "",
      price: BigInt(23232424),
    },
  },
  {
    id: "2",
    character: mockCharacters[1],
    equippedItems: mockCharacterItems,
    sell: {
      publicFacet: "",
      price: BigInt(33909023),
    },
  },
  {
    id: "3",
    character: mockCharacters[2],
    equippedItems: mockCharacterItems,
    sell: {
      publicFacet: "",
      price: BigInt(3430),
    },
  },
  {
    id: "4",
    character: mockCharacters[3],
    equippedItems: mockCharacterItems,
    sell: {
      publicFacet: "",
      price: BigInt(873090),
    },
  },
  {
    id: "5",
    character: mockCharacters[4],
    equippedItems: mockCharacterItems,
    sell: {
      publicFacet: "",
      price: BigInt(80909090),
    },
  },
  {
    id: "6",
    character: mockCharacters[5],
    equippedItems: mockCharacterItems,
    sell: {
      publicFacet: "",
      price: BigInt(10),
    },
  },
  {
    id: "7",
    character: mockCharacters[6],
    equippedItems: mockCharacterItems,
    sell: {
      publicFacet: "",
      price: BigInt(1000000),
    },
  },
  {
    id: "8",
    character: mockCharacters[7],
    equippedItems: mockCharacterItems,
    sell: {
      publicFacet: "",
      price: BigInt(105000),
    },
  },
  {
    id: "9",
    character: mockCharacters[8],
    equippedItems: mockCharacterItems,
    sell: {
      publicFacet: "",
      price: BigInt(100),
    },
  },
  {
    id: "10",
    character: mockCharacters[9],
    equippedItems: mockCharacterItems,
    sell: {
      publicFacet: "",
      price: BigInt(40000),
    },
  },
];
