import { Item } from "@agoric/types";

export const findEquipped = (items: Item[]) => items.find((item) => item.equipped === true);
