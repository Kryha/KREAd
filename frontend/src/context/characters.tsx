import React, { createContext, useReducer, useContext } from "react";

import { Character } from "../types/character";

export type CharacterState = {
  characters: Character[];
  fetched: boolean;
};

const initialState: CharacterState = {
  characters: [],
  fetched: false,
};

export interface SetCharacters {
  type: "SET_CHARACTERS";
  payload: Character[];
}
export interface AddCharacters {
  type: "ADD_CHARACTERS";
  payload: Character[];
}
export interface SetFetched {
  type: "SET_FETCHED";
  payload: boolean;
}
export interface Reset {
  type: "RESET";
}

export type CharacterStateActions =
  | Reset
  | SetFetched
  | SetCharacters
  | AddCharacters;

type Dispatch = React.Dispatch<CharacterStateActions>;
type ProviderProps = Omit<React.ProviderProps<CharacterState>, "value">;

const Context = createContext<CharacterState | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const Reducer = (state: CharacterState, action: CharacterStateActions): CharacterState => {
  switch (action.type) {
  case "SET_CHARACTERS":
    return { ...state, characters: action.payload };
    
  case "ADD_CHARACTERS":
    return { ...state, characters: [...state.characters, ...action.payload]};

  case "SET_FETCHED":
    return { ...state, fetched: action.payload };
    
  case "RESET":
    return initialState;

  default:
    throw new Error("Only defined action types can be handled;");
  }
};

export const CharacterStateProvider = (props: ProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{props.children}</DispatchContext.Provider>
    </Context.Provider>
  );
};

export const useCharacterState = (): CharacterState => {
  const state = useContext(Context);
  if (state === undefined) {
    throw new Error("useCharacterState can only be called inside CharacterStateProvider.");
  }
  return state;
};

export const useCharacterStateDispatch = (): React.Dispatch<CharacterStateActions> => {
  const dispatch = useContext(DispatchContext);
  if (dispatch === undefined) {
    throw new Error("useCharacterDispatch can only be called inside a CharacterProvider.");
  }
  return dispatch;
};

export const useCharacterContext = (): [CharacterState, Dispatch] => [useCharacterState(), useCharacterStateDispatch()];