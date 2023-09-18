import { FunctionComponent, PropsWithChildren } from "react";
import { UserContextProvider } from "./user";
import { WalletContextProvider } from "./wallet";
import { CharacterBuilderContextProvider } from "./character-builder-context";
import { CharacterMarketContextProvider } from "./character-shop-context";
import { ItemMarketContextProvider } from "./item-shop-context";

export const UseWithContext: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <WalletContextProvider>
    <UserContextProvider>
      <CharacterBuilderContextProvider>
        <CharacterMarketContextProvider>
          <ItemMarketContextProvider>{children}</ItemMarketContextProvider>
        </CharacterMarketContextProvider>
      </CharacterBuilderContextProvider>
    </UserContextProvider>
  </WalletContextProvider>
);
