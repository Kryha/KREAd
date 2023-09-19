import { CharacterBackend, ExtendedCharacter, Item } from "../interfaces";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { mediate } from "../util";
import { dedupArrById, replaceCharacterInventoryInUserStateArray } from "../util/other";
import { useWalletState } from "./wallet";
import { useAgoricState } from "./agoric";
import { extendCharacters } from "../service/transform-character";
import { CATEGORY } from "../constants";

export interface UserContext {
  characters: ExtendedCharacter[];
  selected: ExtendedCharacter | undefined;
  items: Item[];
  equippedItems: Item[];
  processed: string[];
  fetched: boolean;
  inventoryCallInProgress: boolean;
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
  payload: Item[];
}
interface SetEquippedItems {
  type: "SET_EQUIPPED_ITEMS";
  payload: Item[];
}
interface UpdateCharacterItems {
  type: "UPDATE_CHARACTER_ITEMS";
  payload: Item[];
  characterName: string;
}
interface SetFetched {
  type: "SET_FETCHED";
  payload: boolean;
}
interface StartInventoryCall {
  type: "START_INVENTORY_CALL";
}
interface EndInventoryCall {
  type: "END_INVENTORY_CALL";
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
  | StartInventoryCall
  | EndInventoryCall
  | Reset;

const initialState: UserContext = {
  characters: [],
  selected: undefined,
  items: [],
  equippedItems: [],
  processed: [],
  fetched: false,
  inventoryCallInProgress: false,
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
      return { ...state, items: action.payload, fetched: true };
    }

    case "UPDATE_CHARACTER_ITEMS": {
      const frontendEquippedItems = mediate.items.toFront(action.payload);
      const equippedCharacterItems = [];
      equippedCharacterItems.push(...frontendEquippedItems);
      const equipped: { [key: string]: Item | undefined } = {};
      for (const category of Object.keys(CATEGORY)) {
        equipped[category] = frontendEquippedItems.find((item: Item) => item.category === category);
      }

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

    case "START_INVENTORY_CALL":
      return { ...state, inventoryCallInProgress: true };

    case "END_INVENTORY_CALL":
      return { ...state, inventoryCallInProgress: false };

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

  const charactersInWallet = useMemo(() => (wallet.character ? wallet.character : []), [wallet.character]);
  const itemsInWallet = useMemo(() => (wallet.item ? wallet.item : []), [wallet.item]);

  useEffect(() => {
    const processPurseChanges = async () => {
      console.count("👜 PROCESSING PURSE CHANGE");

      // Always run on purse updates
      userStateDispatch({ type: "SET_ITEMS", payload: itemsInWallet });
      userStateDispatch({ type: "SET_FETCHED", payload: true });

      const processedCharacters = [...userState.processed].sort();
      const ownedCharacterNames: string[] = charactersInWallet.map((character: CharacterBackend) => character.name).sort();

      // Empty character wallet
      if (charactersInWallet.length === 0 && !userState.inventoryCallInProgress) {
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
      if (charactersInWallet.length < processedCharacters.length && !userState.inventoryCallInProgress) {
        processedCharacters.forEach((name) => {
          if (!ownedCharacterNames.includes(name)) {
            processedCharacters.splice(processedCharacters.indexOf(name), 1);
          }
        });
        userStateDispatch({
          type: "SET_PROCESSED",
          payload: processedCharacters,
        });
      }

      const charactersToProcess = charactersInWallet.filter((character: { name: string }) => !processedCharacters.includes(character.name));

      const extendedCharacters = await extendCharacters(charactersToProcess, agoric.chainStorageWatcher.marshaller);

      const frontendCharacters = mediate.characters.toFront(extendedCharacters.extendedCharacters);

      userStateDispatch({ type: "SET_CHARACTERS", payload: frontendCharacters });
      userStateDispatch({ type: "SET_EQUIPPED_ITEMS", payload: extendedCharacters.equippedItems });
    };

    processPurseChanges().catch((err) => {
      console.error("got watchNotifiers err", err);
    });
    userStateDispatch({ type: "SET_FETCHED", payload: true });
  }, [charactersInWallet, itemsInWallet, userState.processed, userState.inventoryCallInProgress]);

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
