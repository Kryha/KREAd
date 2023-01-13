import { E } from "@endo/eventual-send";
import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { useAgoricState } from "./agoric";
import { useWalletState } from "./wallet";
import { CharacterBackend, ExtendedCharacter, ExtendedCharacterBackend, Item } from "../interfaces";
import { mediate } from "../util";
import { itemCategories } from "../service/util";

interface UserContext {
  characters: ExtendedCharacter[],
  selected: ExtendedCharacter | undefined,
  items: Item[],
  equippedItems: Item[],
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
interface Reset {
  type: "RESET",
}
type UserStateActions = SetSelected | SetState | Reset;

const initialState: UserContext = {
  characters: [],
  selected: undefined,
  items: [],
  equippedItems: [],
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
    const processPurseChanges = async () => {
      console.count("👜 PROCESSING PURSE CHANGE 👜");
      const equippedCharacterItems: Item[] = [];
      // Map characters to the corresponding inventory in the contract
      const extendedCharacters: ExtendedCharacterBackend[] = await Promise.all(
        charactersInWallet.map(async (character: CharacterBackend): Promise<ExtendedCharacterBackend> => {
          const activityHistory = await E(kreadPublicFacet).getCharacterHistory(character.name);
          const activity = activityHistory.map((event: any) => ({
            type: event.type,
            to: "unknown",
            date: event.timestamp,
          }));

          const { items: equippedItems } = await E(kreadPublicFacet).getCharacterInventory(character.name);
          const frontendEquippedItems = mediate.items.toFront(equippedItems);
          equippedCharacterItems.push(...frontendEquippedItems);
          const equipped: { [key: string]: Item | undefined } = {};
          itemCategories.forEach((category) => {
            equipped[category] = frontendEquippedItems.find((item: Item) => item.category === category);
          });

          return {
            nft: character,
            equippedItems: equipped,
            activity,
          };
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
    return () => {
      userStateDispatch({type: "RESET"});
    };
  }, [kreadPublicFacet, charactersInWallet, itemsInWallet]);
  
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