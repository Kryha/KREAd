import { FunctionComponent, PropsWithChildren } from "react";
import { CharacterMarketContextProvider } from "./character-shop";
import { ItemMarketContextProvider } from "./item-shop";


export const UseWithMarketContext: FunctionComponent<PropsWithChildren> = ({ children }) =>
  <CharacterMarketContextProvider>
    <ItemMarketContextProvider>
      {children}
    </ItemMarketContextProvider>
  </CharacterMarketContextProvider>;