import { FC, useMemo, useState } from "react";

import { text } from "../../assets";
import { AnimatedLogo, BaseRoute, SwitchSelector } from "../../components";
import { KreadContainer, ShopWrapper } from "./styles";
import { ItemsShop } from "./items-shop";
import { CharactersShop } from "./characters-shop";
import { useViewport } from "../../hooks";

export enum Page {
  Items = 0,
  Characters = 1,
}

export const Shop: FC = () => {
  const [selectedPage, setSelectedPage] = useState<Page>(Page.Items);
  const { width, height } = useViewport();
  const pageSelector = useMemo(
    () => (
      <SwitchSelector
        buttonOneText={text.character.items}
        buttonTwoText={text.character.characters}
        setSelectedIndex={setSelectedPage}
        selectedIndex={selectedPage}
      />
    ),
    [selectedPage]
  );

  return (
    <BaseRoute sideNavigation={<></>}>
      <ShopWrapper>
        {selectedPage === Page.Items ? <ItemsShop pageSelector={pageSelector} /> : <CharactersShop pageSelector={pageSelector} />}
      </ShopWrapper>
      <KreadContainer height={height} width={width}>
        <AnimatedLogo iteration={1} />
      </KreadContainer>
    </BaseRoute>
  );
};
