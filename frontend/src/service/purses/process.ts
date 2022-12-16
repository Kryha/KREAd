import { E } from "@endo/eventual-send";
import { PAGE_SIZE } from "../../constants";

import { CharacterBackend, ExtendedCharacterBackend, Item } from "../../interfaces";
import { AgoricDispatch } from "../../interfaces/agoric.interfaces";
import { CharacterDispatch } from "../../interfaces/character-actions.interfaces";
import { ItemDispatch } from "../../interfaces/item-actions.interfaces";
import { mediate } from "../../util";
import { itemCategories } from "../util";

// This fetches assets data from purses in the wallet and updates the local context state for characters & items
export const processPurses = async (
  purses: any[],
  contractPublicFacet: any,
  characterDispatch: CharacterDispatch,
  itemDispatch: ItemDispatch,
  agoricDispatch: AgoricDispatch,
  brandsToCheck: { money: string; character: string; item: string, token: string }
) => {
  // Load Purses
  const newMoneyPurses = purses.filter(({ brandBoardId }) => brandBoardId === brandsToCheck.money);
  const newTokenPurses = purses.filter(({ brandBoardId }) => brandBoardId === brandsToCheck.token);

  const newCharacterPurses = purses.filter(
    ({ brandBoardId }) => brandBoardId === brandsToCheck.character // || brandBoardId === CHARACTER_ZFC_BRAND_BOARD_ID,
  );
  const newItemPurses = purses.filter(
    ({ brandBoardId }) => brandBoardId === brandsToCheck.item // || brandBoardId === CHARACTER_ZFC_BRAND_BOARD_ID,
  );


  agoricDispatch({ type: "SET_MONEY_PURSES", payload: newMoneyPurses });
  agoricDispatch({ type: "SET_CHARACTER_PURSES", payload: newCharacterPurses });
  agoricDispatch({ type: "SET_ITEM_PURSES", payload: newItemPurses });
  agoricDispatch({ type: "SET_TOKEN_PURSES", payload: newTokenPurses });

  // Load Characters
  const ownedCharacters = newCharacterPurses.flatMap((purse) => {
    return purse.value;
  });

  const equippedCharacterItems: Item[] = [];
  // Map characters to the corresponding inventory in the contract
  const extendedCharacters: ExtendedCharacterBackend[] = await Promise.all(
    ownedCharacters.map(async (character: CharacterBackend): Promise<ExtendedCharacterBackend> => {
      const activityHistory = await E(contractPublicFacet).getCharacterHistory(character.name);
      const activity = activityHistory.map((event: any) => ({
        type: event.type,
        to: "unknown",
        date: event.timestamp,
      }));

      const { items: equippedItems } = await E(contractPublicFacet).getCharacterInventory(character.name);
      const frontendEquippedItems = mediate.items.toFront(equippedItems);
      equippedCharacterItems.push(...frontendEquippedItems);
      const equipped: {[key: string]: Item | undefined} = {};
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

  if (extendedCharacters.length) {
    const frontendCharacters = mediate.characters.toFront(extendedCharacters);
    characterDispatch({ type: "SET_OWNED_CHARACTERS", payload: frontendCharacters });
    characterDispatch({ type: "SET_SELECTED_CHARACTER", payload: frontendCharacters[0] });
  }
  // Finish loading Characters
  characterDispatch({ type: "SET_FETCHED", payload: true });

  // Load owned Items from wallet and character inventories
  const ownedItems = newItemPurses.flatMap((purse) => purse.value);
  const ownedItemsFrontend = mediate.items.toFront(ownedItems);
  itemDispatch({ type: "SET_OWNED_ITEMS", payload: ownedItemsFrontend });
  itemDispatch({ type: "SET_EQUIPPED_ITEMS", payload: equippedCharacterItems });
  itemDispatch({ type: "SET_FETCHED", payload: true });

  console.info(`👤 Found ${ownedCharacters.length} characters.`);
  console.info(`📦 Found ${ownedItems.length} Items.`);
  console.info("👛 Money Purse Info: ", newTokenPurses[0].displayInfo);
  console.info("👛 Money Purse Petname: ", newTokenPurses[0].brandPetname);
  console.info("👛 Character Purse Info: ", newCharacterPurses[0].displayInfo);
  console.info("👛 Character Purse Petname: ", newCharacterPurses[0].brandPetname);
  console.info("👛 Item Purse Info: ", newItemPurses[0].displayInfo);
  console.info("👛 Item Purse Petname: ", newItemPurses[0].brandPetname);
};

export const processOffers = async (offers: any[], agoricDispatch: AgoricDispatch) => {
  if (!offers.length) return;
  agoricDispatch({ type: "SET_OFFERS", payload: offers });
};
