import { FC, useMemo, useState } from "react";

import { text } from "../../assets";
import { BaseRoute, SwitchSelector } from "../../components";
import { KreadContainer, ShopWrapper } from "./styles";
import { ItemsShop } from "./items-shop";
import { CharactersShop } from "./characters-shop";
import { useViewport } from "../../hooks";
import { KreadIcon } from "../../components/logo/styles";
import { ItemMarketContextProvider } from "../../context/item-shop";
import { CharacterMarketContextProvider } from "../../context/character-shop";

export enum Page {
  Items = 0,
  Characters = 1,
}

export const Shop: FC = () => {
  const [marketSection, setMarketSection] = useState<Page>(Page.Items);
  const { width, height } = useViewport();
  const pageSelector = useMemo(
    () => (
      <SwitchSelector
        buttonOneText={text.character.items}
        buttonTwoText={text.character.characters}
        setSelectedIndex={setMarketSection}
        selectedIndex={marketSection}
      />
    ),
    [marketSection],
  );

  return (
    <CharacterMarketContextProvider>
      <ItemMarketContextProvider>
        <BaseRoute sideNavigation={<></>}>
          <ShopWrapper>
            {marketSection === Page.Items ? <ItemsShop pageSelector={pageSelector} /> : <CharactersShop pageSelector={pageSelector} />}
          </ShopWrapper>
          <KreadContainer height={height} width={width}>
            <KreadIcon />
          </KreadContainer>
        </BaseRoute>
      </ItemMarketContextProvider>
    </CharacterMarketContextProvider>
  );
};
