import React, { createContext, FC, useMemo, useState } from "react";
import { useAndRequireContext } from "../hooks";
import { Category, Origin, Rarity, Title } from "../interfaces";
import { MAX_PRICE, MIN_PRICE } from "../constants";

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
  price: { min: number; max: number };
  setEquippedTo: (value: string) => void;
  setOrigin: (value: Origin[]) => void;
  setCategories: (value: Category[]) => void;
  setRarity: (value: Rarity[]) => void;
  setSort: (value: string) => void;
  setTitle: (value: Title[]) => void;
  setColors: (value: string) => void;
  setForSale: (value: boolean) => void;
  setPrice: (value: { min: number; max: number }) => void;
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
  const [price, setPrice] = useState<{
    min: number;
    max: number;
  }>({ min: MIN_PRICE, max: MAX_PRICE });
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

  //TODO: Needs to be improved. not necessary now but will be in the future

  // const [, setSearchParams] = useSearchParams();
  //
  // useEffect(() => {
  //   setSearchParams(
  //     {
  //       character,
  //       categories,
  //       origin,
  //       rarity,
  //       sort,
  //       colors,
  //       forSale: forSale ? "true" : "false",
  //       equippedTo,
  //     },
  //     {
  //       relative: "path",
  //     },
  //   );
  // }, [character, categories, origin, rarity, colors, equippedTo, forSale, sort]);

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
      price,
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
      setPrice,
      setReset,
      onReset,
      toggleWidget,
    }),
    [character, categories, colors, equippedTo, forSale, origin, price, rarity, reset, sort, title, showKadoWidget],
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
