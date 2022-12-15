import { FC, useMemo, useState } from "react";

import { BaseRoute, SwitchSelector } from "../../components";
import { text } from "../../assets/text";
import { Page } from "../shop";
import { InventoryWrapper, KreadContainer } from "./styles";
import { ItemsInventory } from "./item-inventory";
import { CharactersInventory } from "./character-inventory";
import { useViewport } from "../../hooks";
import { KreadIcon } from "../../components/logo/styles";
import { newBuyCharacter } from "../../service/character-actions";
import { useAgoricContext } from "../../context/agoric";

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
    <BaseRoute sideNavigation={<></>}>
      <InventoryWrapper>{pageSelector}</InventoryWrapper>
      {showItemsInventory ? <ItemsInventory /> : <CharactersInventory />}
      <KreadContainer height={height} width={width}>
        <KreadIcon />
      </KreadContainer>
    </BaseRoute>
  );
};
