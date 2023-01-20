import { E } from "@endo/eventual-send";
import { CharacterBackend, ExtendedCharacterBackend, Item } from "../../interfaces";
import { itemCategories } from "../../service/util";
import { mediate } from "../../util";
import { UserDispatch } from "./user";

export const processCharacterUpdate = async (
  kreadPublicFacet: any,
  charactersInWallet: CharacterBackend[],
  processedCharacters: string[],
  ownedCharacterNames: string[],
  processInventory: (name: string) => void,
  userStateDispatch: UserDispatch) => {

  // User has less characters than before, adjust the state accordingly
  if (charactersInWallet.length < processedCharacters.length) {
    processedCharacters.forEach((name) => {
      if (!ownedCharacterNames.includes(name)) {
        processedCharacters.splice(processedCharacters.indexOf(name), 1);
      }
    });
    userStateDispatch({type: "SET_PROCESSED", payload: processedCharacters});
  }

  const equippedCharacterItems: Item[] = [];
        
  const charactersToProcess = charactersInWallet.filter((character: { name: string}) => !processedCharacters.includes(character.name));
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
  const frontendCharacters = mediate.characters.toFront(extendedCharacters);
  userStateDispatch({
    type: "SET_CHARACTERS",
    payload: frontendCharacters,
  });
  userStateDispatch({
    type: "SET_EQUIPPED_ITEMS",
    payload: equippedCharacterItems,
  });
};
