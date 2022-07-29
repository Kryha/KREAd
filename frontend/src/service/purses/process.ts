import { E } from "@endo/eventual-send";
import { CharacterBackend, ExtendedCharacterBackend, Item } from "../../interfaces";
import { AgoricDispatch } from "../../interfaces/agoric.interfaces";
import { CharacterDispatch } from "../../interfaces/character-actions.interfaces";
import { ItemDispatch } from "../../interfaces/item-actions.interfaces";
import { mediate } from "../../util";

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

  const equippedCharacterItems: Item[] = [];
  // Map characters to the corresponding inventory in the contract
  const charactersWithItems: ExtendedCharacterBackend[] = await Promise.all(
    ownedCharacters.map(async (character: CharacterBackend) => {
      const {
        items: equippedItems,
      } = await E(contractPublicFacet).getCharacterInventory(character.name);

      const frontendEquippedItems = mediate.items.toFront(equippedItems);

      equippedCharacterItems.push(...frontendEquippedItems);
      return {
        nft: character,
        equippedItems: {
          hair: frontendEquippedItems.find((item: Item) => item.category === "hair"),
          headPiece: frontendEquippedItems.find((item: Item) => item.category === "headPiece"),
          noseline: frontendEquippedItems.find((item: Item) => item.category === "noseline"),
          background: frontendEquippedItems.find((item: Item) => item.category === "background"),
          midBackground: frontendEquippedItems.find((item: Item) => item.category === "midBackground"),
          mask: frontendEquippedItems.find((item: Item) => item.category === "mask"),
          airReservoir: frontendEquippedItems.find((item: Item) => item.category === "airReservoir"),
          liquid: frontendEquippedItems.find((item: Item) => item.category === "liquid"),
          clothing: frontendEquippedItems.find((item: Item) => item.category === "clothing"),
          frontMask: frontendEquippedItems.find((item: Item) => item.category === "frontMask"),
        },
      };
    })
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

  console.info(`👤 Found ${ownedCharacters.length} characters.`);
  console.info(`📦 Found ${ownedItems.length} Items.`);
  console.info("👛 Money Purse Info: ", newTokenPurses[0].displayInfo);
  console.info("👛 Money Purse Petname: ", newTokenPurses[0].brandPetname);
  console.info("👛 Character Purse Info: ", newCharacterPurses[0].displayInfo);
  console.info("👛 Character Purse Petname: ", newCharacterPurses[0].brandPetname);
  console.info("👛 Item Purse Info: ", newItemPurses[0].displayInfo);
  console.info("👛 Item Purse Petname: ", newItemPurses[0].brandPetname);
};
