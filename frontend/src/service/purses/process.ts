import { ServiceDispatch } from "../../context/service";
import { CharacterDispatch } from "../../interfaces/character-actions.interfaces";

export const processPurses = (
  purses: any[],
  characterDispatch: CharacterDispatch,
  serviceDispatch: ServiceDispatch,
  brandsToCheck: { money: string; character: string }
) => {
  const newTokenPurses = purses.filter(({ brandBoardId }) => brandBoardId === brandsToCheck.money);
  const newCharacterPurses = purses.filter(
    ({ brandBoardId }) => brandBoardId === brandsToCheck.character // || brandBoardId === CHARACTER_ZFC_BRAND_BOARD_ID,
  );

  serviceDispatch({ type: "SET_TOKEN_PURSES", payload: newTokenPurses });
  serviceDispatch({ type: "SET_CHARACTER_PURSES", payload: newCharacterPurses });

  const ownedCharacters = newCharacterPurses.flatMap((purse) => {
    return purse.value;
  });

  characterDispatch({ type: "SET_OWNED_CHARACTERS", payload: ownedCharacters });

  console.info(`👤 Found characters: ${[ownedCharacters]}`);
  console.info("👛 Money Purse Info: ", newTokenPurses[0].displayInfo);
  console.info("👛 Money Purse Petname: ", newTokenPurses[0].brandPetname);
  console.info("👛 Character Purse Info: ", newCharacterPurses[0].displayInfo);
  console.info("👛 Character Purse Petname: ", newCharacterPurses[0].brandPetname);
};
