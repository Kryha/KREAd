import { FC, useMemo, useState } from "react";

import { text } from "../../assets";
import { BaseRoute, SwitchSelector, Title } from "../../components";
import { ShopWrapper } from "./styles";
import { ItemsShop } from "./items-shop";
import { CharactersShop } from "./characters-shop";

enum Page {
  Items = 0,
  Characters = 1,
}

export const Shop: FC = () => {
  const [selectedPage, setSelectedPage] = useState<Page>(Page.Items);

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
    <BaseRoute sideNavigation={<Title title={text.navigation.shop} />}>
      <ShopWrapper>
        {selectedPage === Page.Items ? <ItemsShop pageSelector={pageSelector} /> : <CharactersShop pageSelector={pageSelector} />}
      </ShopWrapper>
    </BaseRoute>
  );
};
