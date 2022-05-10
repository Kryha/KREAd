import { CharacterItems } from "./items";

export interface Character {
  name: string;
  items: CharacterItems;
  id: string;
  equipped: boolean;
}
