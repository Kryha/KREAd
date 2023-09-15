import { useEffect, useState } from "react";

export const useLocalStorage = (key: string) => {
  const initialDefault = true;
  const [appState, setAppState] = useState(() => {
    const localStorageappState = localStorage.getItem(key);

    return localStorageappState !== null ? JSON.parse(localStorageappState) : initialDefault;
  });

  useEffect(() => {
    if (localStorage.getItem(key) === null) {
      setAppState(initialDefault);
    }
  }, [key, initialDefault]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(appState));
  }, [appState, key]);

  return [appState, setAppState];
};
