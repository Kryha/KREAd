import { FunctionComponent, PropsWithChildren } from "react";
import { UserContextProvider } from "./user";
import { CharacterMarketContextProvider } from "./character-shop";
import { ItemMarketContextProvider } from "./item-shop";
import { WalletContextProvider } from "./wallet";

export const UseWithContext: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <WalletContextProvider>
    <UserContextProvider>
      <CharacterMarketContextProvider>
        <ItemMarketContextProvider>{children}</ItemMarketContextProvider>
      </CharacterMarketContextProvider>
    </UserContextProvider>
  </WalletContextProvider>
);
