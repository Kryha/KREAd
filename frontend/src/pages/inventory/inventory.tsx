import { FC, useMemo, useState } from "react";

import { BaseRoute, SwitchSelector } from "../../components";
import { text } from "../../assets/text";
import { Title } from "../../components/title";
import { Page } from "../shop";
import { InventoryWrapper } from "./styles";
import { ItemsInventory } from "./item-inventory";
import { CharactersInventory } from "./character-inventory";

export const Inventory: FC = () => {
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

  const showItemsInventory = selectedPage === Page.Items;
  return (
    <BaseRoute sideNavigation={<Title title={text.navigation.inventory} />}>
      <InventoryWrapper>{pageSelector}</InventoryWrapper>
      {showItemsInventory ? <ItemsInventory /> : <CharactersInventory />}
    </BaseRoute>
  );
};
