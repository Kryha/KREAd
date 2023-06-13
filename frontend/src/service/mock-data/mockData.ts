import { ExtendedCharacter } from '../../interfaces';
import { mockCharacters } from './mockCharacters';
import { mockCharacterItems } from './mockCharacterItems';
import { UserContext } from '../../context/user';
import { mockItems, mockItemsEquipped } from './mockItems';

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
  }
  ];

export const mockData : UserContext = {
  characters: mockedExtendedCharacters,
  selected: undefined,
  items: mockItems,
  equippedItems: mockItemsEquipped,
  processed: [],
  fetched: true,
}
