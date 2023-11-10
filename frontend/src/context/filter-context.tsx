import React, { createContext, FC, useMemo, useState } from "react";
import { useAndRequireContext } from "../hooks";
import { Category, Origin, Rarity, Title } from "../interfaces";
import { useGetCharacterMarketPrices, useGetItemMarketPrices } from "../service";
import { uISTToIST } from "../util";

interface Context {
  title: Title[];
  origin: Origin[];
  rarity: Rarity[];
  categories: Category[];
  sort: string;
  reset: boolean;
  colors: string;
  forSale: boolean;
  equippedTo: string;
  itemPrice: { min: number; max: number };
  characterPrice: { min: number; max: number };
  setEquippedTo: (value: string) => void;
  setOrigin: (value: Origin[]) => void;
  setCategories: (value: Category[]) => void;
  setRarity: (value: Rarity[]) => void;
  setSort: (value: string) => void;
  setTitle: (value: Title[]) => void;
  setColors: (value: string) => void;
  setForSale: (value: boolean) => void;
  setItemPrice: (value: { min: number; max: number }) => void;
  setCharacterPrice: (value: { min: number; max: number }) => void;
  onReset: () => void;
  showKadoWidget: boolean;
  toggleWidget: () => void;
}

interface Props {
  children: React.ReactNode;
}

const ContextRef = createContext<Context | undefined>(undefined);

export const FiltersContextProvider: FC<Props> = ({ children }) => {
  const [title, setTitle] = useState<Title[]>([]);
  const [origin, setOrigin] = useState<Origin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pricesOfItems] = useGetItemMarketPrices();
  const [pricesOfCharacters] = useGetCharacterMarketPrices();

  const [itemPrice, setItemPrice] = useState<{
    min: number;
    max: number;
  }>({ min: uISTToIST(Math.min(...pricesOfItems)), max: uISTToIST(Math.max(...pricesOfItems)) });
  const [characterPrice, setCharacterPrice] = useState<{
    min: number;
    max: number;
  }>({ min: uISTToIST(Math.min(...pricesOfCharacters)), max: uISTToIST(Math.max(...pricesOfCharacters)) });

  const [rarity, setRarity] = useState<Rarity[]>([]);
  const [equippedTo, setEquippedTo] = useState<string>("");
  const [forSale, setForSale] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("");
  const [colors, setColors] = useState<string>("");
  const [reset, setReset] = useState<boolean>(false);
  const [character, setCharacter] = useState<string>("");
  const [showKadoWidget, setShowKadoWidget] = useState<boolean>(false);

  const onReset = () => {
    setCategories([]);
    setCharacter("");
    setOrigin([]);
    setRarity([]);
    setTitle([]);
    setSort("");
    setColors("");
    setReset(!reset);
  };

  const toggleWidget = () => {
    setShowKadoWidget(!showKadoWidget);
  };

  const contextValue = useMemo(
    () => ({
      origin,
      character,
      title,
      rarity,
      categories,
      sort,
      reset,
      colors,
      forSale,
      equippedTo,
      itemPrice,
      characterPrice,
      showKadoWidget,
      setTitle,
      setCharacter,
      setEquippedTo,
      setOrigin,
      setCategories,
      setRarity,
      setSort,
      setColors,
      setForSale,
      setItemPrice,
      setCharacterPrice,
      setReset,
      onReset,
      toggleWidget,
    }),
    [origin, character, title, rarity, categories, sort, reset, colors, forSale, equippedTo, itemPrice, characterPrice, showKadoWidget],
  );

  return <ContextRef.Provider value={contextValue}>{children}</ContextRef.Provider>;
};

export function useFilters() {
  return useAndRequireContext(ContextRef, "useFilters");
}

export function useKadoWidget() {
  const showWidget = useAndRequireContext(ContextRef, "showKadoWidget").showKadoWidget;
  const toggleWidget = useAndRequireContext(ContextRef, "setShowKadoWidget").toggleWidget;

  return { showWidget, toggleWidget };
}
