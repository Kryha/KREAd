import { FunctionComponent, PropsWithChildren } from "react";
import { UserContextProvider } from "./character";
import { CharacterMarketContextProvider } from "./character-shop";
import { ItemMarketContextProvider } from "./item-shop";
import { WalletContextProvider } from "./wallet";

export const UseWithMarketContext: FunctionComponent<PropsWithChildren> = ({ children }) =>
  <WalletContextProvider>
    <UserContextProvider>
      <CharacterMarketContextProvider>
        <ItemMarketContextProvider>
          {children}
        </ItemMarketContextProvider>
      </CharacterMarketContextProvider>
    </UserContextProvider>
  </WalletContextProvider>;
  