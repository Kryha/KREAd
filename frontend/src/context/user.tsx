import { E } from "@endo/eventual-send";
import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { useAgoricState } from "./agoric";
import { useWalletState } from "./wallet";
import { CharacterBackend, CharacterItems, ExtendedCharacter, ExtendedCharacterBackend, Item, ItemBackend } from "../interfaces";
import { mediate } from "../util";
import { itemCategories } from "../service/util";
import { observeIteration } from "@agoric/notifier";
import { replaceCharacterInventoryInUserStateArray } from "../util/other";

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
interface SetState {
  type: "SET_STATE",
  payload: Partial<UserContext>
}
interface SetProcessed {
  type: "SET_PROCESSED",
  payload: string[],
}
interface SetEquippedItems {
  type: "SET_EQUIPPED_ITEMS",
  payload: CharacterItems,
  characterName: string,
}
interface Reset {
  type: "RESET",
}
type UserStateActions = SetSelected | SetState | SetEquippedItems | SetProcessed | Reset;

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
    case "SET_STATE":
      return { ...state, ...action.payload };
    
    case "SET_EQUIPPED_ITEMS": {
      const updatedCharacters = replaceCharacterInventoryInUserStateArray(state.characters, action.characterName, action.payload);      
      return { ...state, characters: updatedCharacters };
    }

    case "SET_PROCESSED":
      return { ...state, processed: [...new Set([...state.processed, ...action.payload])] };

    case "SET_SELECTED":
      return { ...state, selected: action.payload };

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

  const charactersInWallet = useMemo(() => characterWallet.flatMap((purse) => {
    return purse.value;
  }), [characterWallet]);

  const itemsInWallet = useMemo(() => itemWallet.flatMap((purse) => {
    return purse.value;
  }), [itemWallet]);

  useEffect(() => {
    const observer = harden({
      updateState: (value: { character: string, inventory: ItemBackend[] }) => {
        const { character: characterName, inventory } = value;
        const itemsToProcess = inventory.filter((item:ItemBackend )=> !userState.equippedItems.map(i=>i.id).includes(item.id.toString()));

        // Skip updates if no character name or no new items
        if (itemsToProcess.length < 1 || !characterName) return;
        
        console.count("🎒 LOADING INVENTORY CHANGE 🎒");
        
        const frontendEquippedItems = mediate.items.toFront(inventory);
        const equippedCharacterItems = [];
        equippedCharacterItems.push(...frontendEquippedItems);
        const equipped: { [key: string]: Item | undefined } = {};
        itemCategories.forEach((category) => {
          equipped[category] = frontendEquippedItems.find((item: Item) => item.category === category);
        });
        userStateDispatch({ type: "SET_EQUIPPED_ITEMS", payload: equipped, characterName });
      },
      finish: (completion: unknown)=> console.info("INVENTORY NOTIFIER FINISHED", completion),
      fail: (reason: unknown) => console.info("INVENTORY NOTIFIER ERROR", reason),
    });

    const processInventory = async (characterName: string) => {
      if (userState.processed.includes(characterName)) {
        return;
      }
      const inventoryNotifier = E(kreadPublicFacet).getCharacterInventoryNotifier(characterName);
      observeIteration(inventoryNotifier, observer);
      userStateDispatch({ type: "SET_PROCESSED", payload: [characterName] });

      // for await (const item of iterateNotifier(inventoryNotifier)) {
      //   const itemsToProcess = item.filter((item:ItemBackend )=> !userState.equippedItems.map(i=>i.id).includes(item.id.toString()));
      //   console.log(itemsToProcess.length);
      //   console.count("🎒 LOADING INVENTORY CHANGE 🎒");
      //   console.log(`ADDING: ${characterName}${item}`);
      //   const frontendEquippedItems = mediate.items.toFront(item);
      //   equippedCharacterItems.push(...frontendEquippedItems);
      //   const equipped: { [key: string]: Item | undefined } = {};
      //   itemCategories.forEach((category) => {
      //     equipped[category] = frontendEquippedItems.find((item: Item) => item.category === category);
      //   });
      //   console.log(equipped);
      //   userStateDispatch({ type: "SET_EQUIPPED_ITEMS", payload: equippedCharacterItems });
      //   userStateDispatch({ type: "SET_PROCESSED", payload: [characterName] });
      // }
    };
    const processPurseChanges = async () => {
      console.count("👜 PROCESSING PURSE CHANGE 👜");
      const equippedCharacterItems: Item[] = [];
      const charactersToProcess = charactersInWallet.filter(character => !userState.processed.includes(character.name));
      // Map characters to the corresponding inventory in the contract
      const extendedCharacters = await Promise.all(
        charactersToProcess.map(async (character: CharacterBackend): Promise<ExtendedCharacterBackend> => {
          console.log(charactersInWallet, userState.processed, character.name);
          // if (!userState.processed.includes(character.name)) {
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
          // }
        })
      );
      // Load owned Items from wallet and character inventories
      const ownedItemsFrontend = mediate.items.toFront(itemsInWallet);

      if (extendedCharacters.length) {
        const frontendCharacters = mediate.characters.toFront(extendedCharacters);
        const allEquipped = frontendCharacters.flatMap((character) => Object.values(character.equippedItems));
        userStateDispatch({
          type: "SET_STATE",
          payload: {
            characters: frontendCharacters,
            selected: frontendCharacters[0],
            equippedItems: allEquipped,
            items: ownedItemsFrontend,
            fetched: true,
          }
        });
      } else {
        userStateDispatch({
          type: "SET_STATE",
          payload: {
            fetched: true,
          }
        });
      }
    };
        
    if (kreadPublicFacet) {
      processPurseChanges().catch((err) => {
        console.error("got watchNotifiers err", err);
      });
    }
  }, [kreadPublicFacet, charactersInWallet, itemsInWallet, userState.processed, userState.equippedItems]);
  
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