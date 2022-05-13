import { CharacterItems } from "./item.interfaces";

export interface Character {
  name: string;
  items: CharacterItems;
  id: string;
  equipped: boolean;
}
