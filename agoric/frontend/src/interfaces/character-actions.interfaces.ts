import { ExtendedCharacter } from "./character.interfaces";

// TODO: add fetched flag for each array
export type CharacterState = {
  characters: ExtendedCharacter[];
  owned: ExtendedCharacter[];
  fetched: boolean;
  selected?: ExtendedCharacter;
};

interface SetCharacters {
  type: "SET_CHARACTERS";
  payload: ExtendedCharacter[];
}

interface AddCharacters {
  type: "ADD_CHARACTERS";
  payload: ExtendedCharacter[];
}

interface SetOwnedCharacters {
  type: "SET_OWNED_CHARACTERS";
  payload: ExtendedCharacter[];
}

interface AddOwnedCharacters {
  type: "ADD_OWNED_CHARACTERS";
  payload: ExtendedCharacter[];
}

interface SetSelectedCharacter {
  type: "SET_SELECTED_CHARACTER";
  payload: ExtendedCharacter;
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
