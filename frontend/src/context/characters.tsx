import React, { createContext, useReducer, useContext } from "react";

import { CharacterDispatch, CharacterState, CharacterStateActions } from "../interfaces/character-actions.interfaces";

const initialState: CharacterState = {
  selected: undefined,
  characters: [],
  owned: [],
  fetched: false,
};

const Context = createContext<CharacterState | undefined>(undefined);
const DispatchContext = createContext<CharacterDispatch | undefined>(undefined);

const Reducer = (state: CharacterState, action: CharacterStateActions): CharacterState => {
  switch (action.type) {
    case "SET_CHARACTERS":
      return { ...state, fetched: true, characters: action.payload };

    case "ADD_CHARACTERS":
      return { ...state, fetched: true, characters: [...state.characters, ...action.payload] };

    case "SET_OWNED_CHARACTERS":
      return { ...state, owned: action.payload };

    case "ADD_OWNED_CHARACTERS":
      return { ...state, fetched: true, owned: [...state.owned, ...action.payload] };

    case "SET_SELECTED_CHARACTER":
      return { ...state, fetched: true, selected: action.payload };

    case "SET_FETCHED":
      return { ...state, fetched: action.payload };

    case "RESET":
      return initialState;
  }
};

type ProviderProps = Omit<React.ProviderProps<CharacterState>, "value">;

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

export const useCharacterContext = (): [CharacterState, CharacterDispatch] => [useCharacterState(), useCharacterStateDispatch()];
