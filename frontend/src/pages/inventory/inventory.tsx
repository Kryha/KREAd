import { FC, useMemo, useState } from "react";

import { AnimatedLogo, BaseRoute, SwitchSelector } from "../../components";
import { text } from "../../assets/text";
import { Title } from "../../components/title";
import { Page } from "../shop";
import { InventoryWrapper, KreadContainer } from "./styles";
import { ItemsInventory } from "./item-inventory";
import { CharactersInventory } from "./character-inventory";
import { useViewport } from "../../hooks";

export const Inventory: FC = () => {
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

  const showItemsInventory = selectedPage === Page.Items;
  return (
    <BaseRoute sideNavigation={<Title title={text.navigation.inventory} />}>
      <InventoryWrapper>{pageSelector}</InventoryWrapper>
      {showItemsInventory ? <ItemsInventory /> : <CharactersInventory />}
      <KreadContainer height={height} width={width}>
        <AnimatedLogo iteration={1} />
      </KreadContainer>
    </BaseRoute>
  );
};
