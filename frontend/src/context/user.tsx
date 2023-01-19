import { E } from "@endo/eventual-send";
import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { useAgoricState } from "./agoric";
import { useWalletState } from "./wallet";
import { CharacterBackend, ExtendedCharacter, ExtendedCharacterBackend, Item, ItemBackend } from "../interfaces";
import { mediate } from "../util";
import { itemCategories } from "../service/util";
import { observeIteration } from "@agoric/notifier";
import { dedupArrById, dedupArrByName, replaceCharacterInventoryInUserStateArray } from "../util/other";

interface UserContext {
  characters: ExtendedCharacter[],
  selected: ExtendedCharacter | undefined,
  items: Item[],
  equippedItems: Item[],
  processed: string[],
  fetched: boolean,
}

interface SetSelected {
  type: "SET_SELECTED";
  payload: ExtendedCharacter;
}
interface SetCharacters{
  type: "SET_CHARACTERS",
  payload: ExtendedCharacter[],
}
interface SetProcessed {
  type: "SET_PROCESSED",
  payload: string[],
}
interface SetItems {
  type: "SET_ITEMS",
  payload: ItemBackend[];
}
interface SetEquippedItems {
  type: "SET_EQUIPPED_ITEMS",
  payload: Item[];
}
interface UpdateCharacterItems {
  type: "UPDATE_CHARACTER_ITEMS",
  payload: ItemBackend[],
  characterName: string,
}
interface SetFetched {
  type: "SET_FETCHED",
  payload: boolean,
}
interface Reset {
  type: "RESET",
}
type UserStateActions = SetSelected | SetItems | SetFetched | SetCharacters | SetEquippedItems | UpdateCharacterItems | SetProcessed | Reset;

const initialState: UserContext = {
  characters: [],
  selected: undefined,
  items: [],
  equippedItems: [],
  processed: [],
  fetched: false,
};

export type UserDispatch = React.Dispatch<UserStateActions>;
type ProviderProps = Omit<React.ProviderProps<UserContext>, "value">;
const Context = createContext<UserContext | undefined>(undefined);
const DispatchContext = createContext<UserDispatch | undefined>(undefined);

const Reducer = (state: UserContext, action: UserStateActions): UserContext => {
  switch (action.type) {
    case "SET_CHARACTERS":
      
      return { ...state, characters: dedupArrByName([...state.characters, ...action.payload]), fetched: true };
    
    case "SET_ITEMS": {
      const frontendEquippedItems = mediate.items.toFront(action.payload);
      return { ...state, items:  frontendEquippedItems, fetched: true };
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
      const allEquippedItems = state.characters.flatMap(character => Object.values(character.equippedItems)).filter(item=>item!==undefined);
      return { ...state, equippedItems: allEquippedItems, characters: updatedCharacters, selected };
    }

    case "SET_EQUIPPED_ITEMS": {
      const mergedItems = [...state.equippedItems, ...action.payload];
      const equippedItems = dedupArrById(mergedItems);
      return { ...state, equippedItems };
    }

    case "SET_PROCESSED":
      return { ...state, processed: [...new Set([...state.processed, ...action.payload])] };

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
  const [userState, userStateDispatch] = useReducer(Reducer, initialState);
  const wallet = useWalletState();
  const agoric = useAgoricState();

  const kreadPublicFacet = agoric.contracts.characterBuilder.publicFacet; 
  const characterWallet = wallet.character;
  const itemWallet = wallet.item;

  useEffect(() => {
    const observer = harden({
      updateState: (value: { character: string, inventory: ItemBackend[] }) => {
        console.count("🎒 LOADING INVENTORY CHANGE 🎒");
        
        const { character: characterName, inventory } = value;
        userStateDispatch({ type: "UPDATE_CHARACTER_ITEMS", payload: inventory, characterName });
      },
      finish: (completion: unknown)=> console.info("INVENTORY NOTIFIER FINISHED", completion),
      fail: (reason: unknown) => console.info("INVENTORY NOTIFIER ERROR", reason),
    });

    const processInventory = async (characterName: string) => {
      if (userState.processed.includes(characterName)) {
        return;
      }

      
      // Fetch inventory once 
      const { items: equippedItems } = await E(kreadPublicFacet).getCharacterInventory(characterName);
      userStateDispatch({ type: "UPDATE_CHARACTER_ITEMS", payload: equippedItems, characterName });
      
      // Let the notifier handle updates thereafter
      const inventoryNotifier = E(kreadPublicFacet).getCharacterInventoryNotifier(characterName);
      observeIteration(inventoryNotifier, observer);
      userStateDispatch({ type: "SET_PROCESSED", payload: [characterName] });
    };

    const processPurseChanges = async () => {
      const charactersInWallet = characterWallet[characterWallet.length - 1].value;
      const itemsInWallet = itemWallet[itemWallet.length - 1].value;

      if (!charactersInWallet) return;
      console.count("👜 PROCESSING PURSE CHANGE 👜");
      const equippedCharacterItems: Item[] = [];

      const charactersToProcess = charactersInWallet.filter((character: {name: string}) => !userState.processed.includes(character.name));
      // Map characters to the corresponding inventory in the contract
      const extendedCharacters = await Promise.all(
        charactersToProcess.map(async (character: CharacterBackend): Promise<ExtendedCharacterBackend> => {
          const activityHistory = await E(kreadPublicFacet).getCharacterHistory(character.name);
          const activity = activityHistory.map((event: any) => ({
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
      // Load owned Items from wallet and character inventories
      // const ownedItemsFrontend = mediate.items.toFront(itemsInWallet);

      if (extendedCharacters.length) {
        const frontendCharacters = mediate.characters.toFront(extendedCharacters);
        userStateDispatch({
          type: "SET_CHARACTERS",
          payload: frontendCharacters,
        });
        userStateDispatch({
          type: "SET_EQUIPPED_ITEMS",
          payload: equippedCharacterItems,
        });
        if (itemsInWallet) {
          userStateDispatch({
            type: "SET_ITEMS",
            payload: itemsInWallet,
          });
        }
        userStateDispatch({
          type: "SET_SELECTED",
          payload: frontendCharacters[0],
        });
      } else {
        userStateDispatch({
          type: "SET_FETCHED",
          payload: true,
        });
      }
    };
        
    if (kreadPublicFacet) {
      processPurseChanges().catch((err) => {
        console.error("got watchNotifiers err", err);
      });
    }
  }, [kreadPublicFacet, characterWallet, itemWallet, userState.processed]);
  
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