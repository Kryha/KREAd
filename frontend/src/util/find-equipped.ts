import { Character, Item } from "@agoric/types";

export const findEquipped = (items: Item[]) => items.find((item) => item.equipped === true);

export const findEquippedCharacter = (items: Character[]) => items.find((item) => item.equipped === true);
