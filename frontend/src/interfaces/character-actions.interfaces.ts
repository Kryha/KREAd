import { CharacterInMarket, ExtendedCharacter } from "./character.interfaces";

// TODO: add fetched flag for each array
export type CharacterState = {
  characters: ExtendedCharacter[];
  owned: ExtendedCharacter[];
  fetched: boolean;
  selected?: ExtendedCharacter;
  market: CharacterInMarket[];
  marketFetched: boolean;
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

interface SetCharactersMarket {
  type: "SET_CHARACTERS_MARKET";
  payload: CharacterInMarket[];
}

interface AddCharactersMarket {
  type: "ADD_CHARACTERS_MARKET";
  payload: CharacterInMarket[];
}

interface SetSelectedCharacter {
  type: "SET_SELECTED_CHARACTER";
  payload: ExtendedCharacter;
}

interface SetFetched {
  type: "SET_FETCHED";
  payload: boolean;
}

interface SetMarketFetched {
  type: "SET_MARKET_FETCHED";
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
  | AddCharactersMarket
  | SetSelectedCharacter
  | SetMarketFetched;

export type CharacterDispatch = React.Dispatch<CharacterStateActions>;
