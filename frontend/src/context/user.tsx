import { E } from '@endo/eventual-send';
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { useAgoricState } from './agoric';
import { useWalletState } from './wallet';
import {
  CharacterBackend,
  ExtendedCharacter,
  ExtendedCharacterBackend,
  Item,
  ItemActivityEventBackend,
  ItemBackend,
} from '../interfaces';
import { mediate } from '../util';
import { itemCategories } from '../service/util';
import { dedupArrById, replaceCharacterInventoryInUserStateArray } from '../util/other';
import { LOCAL_DEVNET_RPC, STORAGE_NODE_SPEC_INVENTORY } from '../constants';
import { iterateLatest, makeCastingSpec, makeFollower, makeLeader } from '@agoric/casting';
import { mockData } from '../service/mock-data/mockData';
import { mockItemsEquipped } from '../service/mock-data/mockItems';
import { useDataMode } from '../hooks/use-data-mode';

export interface UserContext {
  characters: ExtendedCharacter[];
  selected: ExtendedCharacter | undefined;
  items: Item[];
  equippedItems: Item[];
  processed: string[];
  fetched: boolean;
}

interface SetSelected {
  type: "SET_SELECTED";
  payload: ExtendedCharacter | undefined;
}
interface SetCharacters {
  type: "SET_CHARACTERS";
  payload: ExtendedCharacter[];
}
interface SetProcessed {
  type: "SET_PROCESSED";
  payload: string[];
}
interface SetItems {
  type: "SET_ITEMS";
  payload: ItemBackend[];
}
interface SetEquippedItems {
  type: "SET_EQUIPPED_ITEMS";
  payload: Item[];
}
interface UpdateCharacterItems {
  type: "UPDATE_CHARACTER_ITEMS";
  payload: ItemBackend[];
  characterName: string;
}
interface SetFetched {
  type: "SET_FETCHED";
  payload: boolean;
}
interface Reset {
  type: "RESET";
}
type UserStateActions =
  | SetSelected
  | SetItems
  | SetFetched
  | SetCharacters
  | SetEquippedItems
  | UpdateCharacterItems
  | SetProcessed
  | Reset;

const initialState: UserContext = {
  characters: [],
  selected: undefined,
  items: [],
  equippedItems: [],
  processed: [],
  fetched: false,
};

const initialMockState: UserContext = {
  characters: mockData.characters,
  selected: undefined,
  items: mockData.items,
  equippedItems: mockItemsEquipped,
  processed: [],
  fetched: mockData.fetched,
};

export type UserDispatch = React.Dispatch<UserStateActions>;
type ProviderProps = Omit<React.ProviderProps<UserContext>, "value">;
const Context = createContext<UserContext | undefined>(undefined);
const DispatchContext = createContext<UserDispatch | undefined>(undefined);

const Reducer = (state: UserContext, action: UserStateActions): UserContext => {
  switch (action.type) {
    case "SET_CHARACTERS": {
      return { ...state, characters: action.payload, fetched: true };
    }

    case "SET_ITEMS": {
      const frontendEquippedItems = mediate.items.toFront(action.payload);
      return { ...state, items: frontendEquippedItems, fetched: true };
    }

    case "UPDATE_CHARACTER_ITEMS": {
      const frontendEquippedItems = mediate.items.toFront(action.payload);
      const equippedCharacterItems = [];
      equippedCharacterItems.push(...frontendEquippedItems);
      const equipped: { [key: string]: Item | undefined } = {};
      itemCategories.forEach((category) => {
        equipped[category] = frontendEquippedItems.find((item: Item) => item.category === category);
      });

      const updatedCharacters = replaceCharacterInventoryInUserStateArray(state.characters, action.characterName, equipped);

      let selected = state.selected;
      if (state.selected?.nft.name === action.characterName) {
        selected = { ...state.selected, equippedItems: equipped };
      }
      const allEquippedItems = state.characters
        .flatMap((character) => Object.values(character.equippedItems))
        .filter((item) => item !== undefined);
      return { ...state, equippedItems: allEquippedItems, characters: updatedCharacters, selected };
    }

    case "SET_EQUIPPED_ITEMS": {
      const mergedItems = [...state.equippedItems, ...action.payload];
      const equippedItems = dedupArrById(mergedItems);
      return { ...state, equippedItems };
    }

    case "SET_PROCESSED":
      return { ...state, processed: action.payload.sort() };

    case "SET_SELECTED":
      return { ...state, selected: action.payload };

    case "SET_FETCHED":
      return { ...state, fetched: action.payload };

    case "RESET":
      return initialState;

    default:
      throw new Error("Only defined action types can be handled;");
  }
};

export const UserContextProvider = (props: ProviderProps): React.ReactElement => {

  const { mockData} = useDataMode();

  const [userState, userStateDispatch] =
    useReducer(Reducer, mockData ? initialMockState : initialState);

  const wallet = useWalletState();
  const agoric = useAgoricState();

  const kreadPublicFacet = agoric.contracts.characterBuilder.publicFacet;
  const charactersInWallet = useMemo(() => (wallet.character ? wallet.character.value : []), [wallet.character]);
  const itemsInWallet = useMemo(() => (wallet.item ? wallet.item.value : []), [wallet.item]);

  useEffect(() => {
    const parseInventoryUpdate = (value: { character: string, inventory: ItemBackend[] }) => {
      console.count("🎒 LOADING INVENTORY CHANGE 🎒");
      const { character: characterName, inventory } = value;
      userStateDispatch({ type: "UPDATE_CHARACTER_ITEMS", payload: inventory, characterName });
    };

    const processInventory = async (characterName: string) => {
      if (userState.processed.includes(characterName)) {
        return;
      }

      // Fetch inventory once
      const { items: equippedItems } = await E(kreadPublicFacet).getCharacterInventory(characterName);
      userStateDispatch({ type: "UPDATE_CHARACTER_ITEMS", payload: equippedItems, characterName });

      const leader = makeLeader(LOCAL_DEVNET_RPC);
      const castingSpec = makeCastingSpec(`${STORAGE_NODE_SPEC_INVENTORY}-${characterName}`);
      const follower = makeFollower(castingSpec, leader);

      // Iterate over kread's storageNode follower on local-devnet
      for await (const { value } of iterateLatest(follower)) {
        parseInventoryUpdate(value.value.items);
      }
    };

    const processPurseChanges = async () => {
      console.count("👜 PROCESSING PURSE CHANGE");

      // Always run on purse updates
      userStateDispatch({ type: "SET_ITEMS", payload: itemsInWallet });
      userStateDispatch({ type: "SET_FETCHED", payload: true });

      const processedCharacters = [...userState.processed].sort();
      const ownedCharacterNames: string[] = charactersInWallet.map((character: CharacterBackend) => character.name).sort();

      // Empty character wallet
      if (charactersInWallet.length === 0) {
        userStateDispatch({ type: "SET_CHARACTERS", payload: [] });
        userStateDispatch({ type: "SET_EQUIPPED_ITEMS", payload: [] });
        userStateDispatch({ type: "SET_SELECTED", payload: undefined });

        return;
      }

      // All done here if all chararacters have been processed
      if (processedCharacters.join() === ownedCharacterNames.join()) {
        return;
      }

      // User has at least 1 character, but less characters than before, adjust the state accordingly
      if (charactersInWallet.length < processedCharacters.length) {
        processedCharacters.forEach((name) => {
          if (!ownedCharacterNames.includes(name)) {
            processedCharacters.splice(processedCharacters.indexOf(name), 1);
          }
        });
        userStateDispatch({ type: "SET_PROCESSED", payload: processedCharacters });
      }

      const equippedCharacterItems: Item[] = [];
      const charactersToProcess = charactersInWallet.filter((character: { name: string }) => !processedCharacters.includes(character.name));

      // Map characters to the corresponding inventory in the contract
      const extendedCharacters = await Promise.all(
        charactersToProcess.map(async (character: CharacterBackend): Promise<ExtendedCharacterBackend> => {
          const activityHistory = await E(kreadPublicFacet).getCharacterHistory(character.name);
          const activity = activityHistory.map((event: ItemActivityEventBackend) => ({
            type: event.type,
            to: "unknown",
            date: event.timestamp,
          }));

          const equipped: { [key: string]: Item | undefined } = {};
          const { items: equippedItems } = await E(kreadPublicFacet).getCharacterInventory(character.name);
          const frontendEquippedItems = mediate.items.toFront(equippedItems);

          equippedCharacterItems.push(...frontendEquippedItems);
          itemCategories.forEach((category) => {
            equipped[category] = frontendEquippedItems.find((item: Item) => item.category === category);
          });
          processInventory(character.name);

          return {
            nft: character,
            equippedItems: equipped,
            activity,
          };
        })
      );

      const frontendCharacters = mediate.characters.toFront(extendedCharacters);

      userStateDispatch({ type: "SET_CHARACTERS", payload: frontendCharacters });
      userStateDispatch({ type: "SET_EQUIPPED_ITEMS", payload: equippedCharacterItems });
    };

    if (kreadPublicFacet) {
      processPurseChanges().catch((err) => {
        console.error("got watchNotifiers err", err);
      });
      userStateDispatch({ type: "SET_FETCHED", payload: true });
    }
  }, [kreadPublicFacet, charactersInWallet, itemsInWallet, userState.processed]);

  return (
    <Context.Provider value={userState}>
      <DispatchContext.Provider value={userStateDispatch}>{props.children}</DispatchContext.Provider>
    </Context.Provider>
  );
};

export const useUserState = (): UserContext => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("UserState can only be called inside UserStateProvider.");
  }
  return state;
};

export const useUserStateDispatch = (): React.Dispatch<UserStateActions> => {
  const dispatch = useContext(DispatchContext);
  if (dispatch === undefined) {
    throw new Error("useUserStateDispatch can only be called inside a ServiceProvider.");
  }
  return dispatch;
};
