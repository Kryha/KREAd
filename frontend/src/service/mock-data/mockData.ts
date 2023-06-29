import { ExtendedCharacter } from "../../interfaces";
import { mockCharacterItems } from "./mockCharacterItems";
import { mockCharacters } from "./mockCharacters";
import { UserContext } from "../../context/user";
import { mockItems } from "./mockItems";

export const mockedExtendedCharacters: ExtendedCharacter[] = [
  {
    nft: mockCharacters[0],
    equippedItems: mockCharacterItems,
    activity: [],
    notifier: undefined,
  },
  {
    nft: mockCharacters[1],
    equippedItems: mockCharacterItems,
    activity: [],
    notifier: undefined,
  },
  {
    nft: mockCharacters[2],
    equippedItems: mockCharacterItems,
    activity: [],
    notifier: undefined,
  },
];

export const mockData: UserContext = {
  characters: mockedExtendedCharacters,
  selected: undefined,
  items: mockItems,
  equippedItems: [],
  processed: [],
  fetched: true,
};
