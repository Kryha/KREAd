import { Character } from "./character.interfaces";

export type CharacterState = {
  characters: Character[];
  owned: Character[];
  fetched: boolean;
  selected: Character[];
};

interface SetCharacters {
  type: "SET_CHARACTERS";
  payload: Character[];
}
interface AddCharacters {
  type: "ADD_CHARACTERS";
  payload: Character[];
}
interface SetOwnedCharacters {
  type: "SET_OWNED_CHARACTERS";
  payload: Character[];
}
interface AddOwnedCharacters {
  type: "ADD_OWNED_CHARACTERS";
  payload: Character[];
}
interface SetSelectedCharacter {
  type: "SET_SELECTED_CHARACTER";
  payload: Character;
}
interface SetFetched {
  type: "SET_FETCHED";
  payload: boolean;
}
interface Reset {
  type: "RESET";
}

export type CharacterStateActions =
  | Reset
  | SetFetched
  | SetCharacters
  | AddCharacters
  | SetOwnedCharacters
  | AddOwnedCharacters
  | SetSelectedCharacter;

export type CharacterDispatch = React.Dispatch<CharacterStateActions>;
