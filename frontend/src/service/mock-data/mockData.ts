import { ExtendedCharacter } from "../../interfaces";
import { mockCharacterItems1, mockCharacterItems2 } from "./mockCharacterItems";
import { mockCharacters } from "./mockCharacters";
import { UserContext } from "../../context/user";
import { mockItems1 } from "./mockItems";

export const mockedExtendedCharacters: ExtendedCharacter[] = [
  {
    nft: mockCharacters[0],
    equippedItems: mockCharacterItems1,
    activity: [],
    notifier: undefined,
  },
  {
    nft: mockCharacters[1],
    equippedItems: mockCharacterItems2,
    activity: [],
    notifier: undefined,
  },
];

export const mockData: UserContext = {
  characters: mockedExtendedCharacters,
  selected: undefined,
  items: mockItems1,
  equippedItems: [],
  processed: [],
  fetched: true,
};
