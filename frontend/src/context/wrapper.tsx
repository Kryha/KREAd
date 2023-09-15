import { FunctionComponent, PropsWithChildren } from "react";
import { UserContextProvider } from "./user";
import { CharacterMarketContextProvider } from "./character-shop";
import { ItemMarketContextProvider } from "./item-shop";
import { WalletContextProvider } from "./wallet";
import { CharacterImageProvider } from "./character-image-provider";

export const UseWithContext: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <WalletContextProvider>
    <UserContextProvider>
      <CharacterImageProvider>
        <CharacterMarketContextProvider>
          <ItemMarketContextProvider>{children}</ItemMarketContextProvider>
        </CharacterMarketContextProvider>
      </CharacterImageProvider>
    </UserContextProvider>
  </WalletContextProvider>
);
