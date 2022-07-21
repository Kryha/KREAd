import { Character, CharacterInMarket } from "./character.interfaces";

// TODO: add fetched flag for each array
export type CharacterState = {
  characters: Character[];
  owned: Character[];
  market: CharacterInMarket[];
  fetched: boolean;
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

interface SetCharactersMarket {
  type: "SET_CHARACTERS_MARKET";
  payload: CharacterInMarket[];
}

interface AddCharactersMarket {
  type: "ADD_CHARACTERS_MARKET";
  payload: CharacterInMarket[];
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
  | SetCharactersMarket
  | AddCharactersMarket;

export type CharacterDispatch = React.Dispatch<CharacterStateActions>;
