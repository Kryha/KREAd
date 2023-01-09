import { E } from "@endo/eventual-send";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
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

const initialState: UserContext = {
  characters: [],
  selected: undefined,
  items: [],
  equippedItems: [],
  fetched: false,
};

const Context = createContext<UserContext | undefined>(undefined);

type ProviderProps = Omit<React.ProviderProps<UserContext>, "value">;

export const UserContextProvider = (props: ProviderProps): React.ReactElement => {
  const [userState, userStateDispatch] = useState<UserContext>(initialState);
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
    console.count("🛍 CHARACTER CONTEXT USEEFFECT");

    const processPurseChanges = async () => {
      console.info("Processing new characters");
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
      const ownedItems = itemsInWallet.flatMap((purse) => purse.value);
      const ownedItemsFrontend = mediate.items.toFront(ownedItems);

      if (extendedCharacters.length) {
        const frontendCharacters = mediate.characters.toFront(extendedCharacters);
        const allEquipped = frontendCharacters.flatMap((character) => Object.values(character.equippedItems));
        userStateDispatch(prevState => ({
          ...prevState,
          owned: frontendCharacters,
          selected: frontendCharacters[0],
          equippedItems: allEquipped,
          items: ownedItemsFrontend,
          fetched: true,
        }));
      }
    };
        
      
    if (kreadPublicFacet) {
      processPurseChanges().catch((err) => {
        console.error("got watchNotifiers err", err);
      });
    }
    return () => {
      userStateDispatch(initialState);
    };
  }, [kreadPublicFacet, charactersInWallet, itemsInWallet]);
  
  return (
    <Context.Provider value={userState}>
      {props.children}
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