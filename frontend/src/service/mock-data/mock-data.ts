import { ExtendedCharacter } from "../../interfaces";
import { mockCharacters } from "./mock-characters";
import { UserContext } from "../../context/user";
import { mockCharacterItems, mockItems, mockItemsEquipped } from "./mock-items";

export const mockedExtendedCharacters: ExtendedCharacter[] = [
  {
    nft: mockCharacters[0],
    equippedItems: mockCharacterItems,
    activity: [],
    notifier: undefined,
  },
  {
    nft: mockCharacters[1],
    equippedItems: {},
    activity: [],
    notifier: undefined,
  },
];

export const mockData: UserContext = {
  characters: mockedExtendedCharacters,
  selected: undefined,
  items: mockItems,
  equippedItems: mockItemsEquipped,
  processed: [],
  fetched: true,
};
