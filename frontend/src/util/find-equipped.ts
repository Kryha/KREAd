import { Character, Item } from "../interfaces";

export const findEquipped = (items: Item[]) => items.find((item) => item.equipped === true);

export const findEquippedCharacter = (items: Character[]) => items.find((item) => item.equipped === true);
