import { E } from "@endo/eventual-send";

import { CharacterInMarketBackend } from "../../interfaces";
import { AgoricDispatch } from "../../interfaces/agoric.interfaces";
import { CharacterDispatch } from "../../interfaces/character-actions.interfaces";
import { ItemDispatch } from "../../interfaces/item-actions.interfaces";
import { mediate } from "../../util";
import { extendCharacters } from "../character-actions";

const updateItemsMarket = async (publicFacet: any, dispatch: ItemDispatch) => {
  const { items: itemsMarket } = await E(publicFacet).getItemsMarket();

  const mediatedItemsMarket = mediate.itemsMarket.toFront(itemsMarket);

  dispatch({ type: "SET_ITEMS_MARKET", payload: mediatedItemsMarket });
  dispatch({ type: "SET_MARKET_FETCHED", payload: true });
};

const updateCharactersMarket = async (publicFacet: any, dispatch: CharacterDispatch) => {
  const { characters: charactersMarket } = await E(publicFacet).getCharactersMarket();

  const marketWithItems = await Promise.all(
    charactersMarket.map(async (character: CharacterInMarketBackend) => {
      const { items: equippedItems } = await E(publicFacet).getCharacterInventory(character.character.name);
      return { character, equippedItems };
    })
  );

  const mediatedCharactersMarket = mediate.charactersMarket.toFront(marketWithItems);

  dispatch({ type: "SET_CHARACTERS_MARKET", payload: mediatedCharactersMarket });
  dispatch({ type: "SET_MARKET_FETCHED", payload: true });
};

// This fetches assets data from purses in the wallet and updates the local context state for characters & items
export const processPurses = async (
  purses: any[],
  contractPublicFacet: any,
  characterDispatch: CharacterDispatch,
  itemDispatch: ItemDispatch,
  agoricDispatch: AgoricDispatch,
  brandsToCheck: { money: string; character: string; item: string }
) => {
  // Load Purses
  const newTokenPurses = purses.filter(({ brandBoardId }) => brandBoardId === brandsToCheck.money);
  const newCharacterPurses = purses.filter(
    ({ brandBoardId }) => brandBoardId === brandsToCheck.character // || brandBoardId === CHARACTER_ZFC_BRAND_BOARD_ID,
  );
  const newItemPurses = purses.filter(
    ({ brandBoardId }) => brandBoardId === brandsToCheck.item // || brandBoardId === CHARACTER_ZFC_BRAND_BOARD_ID,
  );

  agoricDispatch({ type: "SET_TOKEN_PURSES", payload: newTokenPurses });
  agoricDispatch({ type: "SET_CHARACTER_PURSES", payload: newCharacterPurses });
  agoricDispatch({ type: "SET_ITEM_PURSES", payload: newItemPurses });

  // Load Characters
  const ownedCharacters = newCharacterPurses.flatMap((purse) => {
    return purse.value;
  });

  const { extendedCharacters: charactersWithItems, equippedItems: equippedCharacterItems } = await extendCharacters(
    contractPublicFacet,
    ownedCharacters
  );

  if (charactersWithItems.length) {
    const frontendCharacters = mediate.characters.toFront(charactersWithItems);
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

  await updateItemsMarket(contractPublicFacet, itemDispatch);
  await updateCharactersMarket(contractPublicFacet, characterDispatch);

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
