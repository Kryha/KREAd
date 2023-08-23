import React, { FC, useState } from "react";
import { BaseRoute, SwitchSelector } from "../../components";
import { text } from "../../assets";
import { Page } from "../shop";
import { InventoryWrapper, KreadContainer } from "./styles";
import { ItemsInventory } from "./item-inventory";
import { CharactersInventory } from "./character-inventory";
import { useIsMobile, useViewport } from "../../hooks";
import { KreadIcon } from "../../components/logo/styles";
import { breakpoints } from "../../design";

export const Inventory: FC = () => {
  const [inventorySection, setInventorySection] = useState<Page>(Page.Items);
  const { width, height } = useViewport();
  const isMobile = useIsMobile(breakpoints.desktop);

  const pageSelector = (
    <SwitchSelector
      buttonOneText={text.character.items}
      buttonTwoText={text.character.characters}
      setSelectedIndex={setInventorySection}
      selectedIndex={inventorySection}
    />
  );

  return (
    <BaseRoute sideNavigation={<></>}>
      <InventoryWrapper>
        {inventorySection === Page.Items ? (
          <ItemsInventory pageSelector={pageSelector} />
        ) : (
          <CharactersInventory pageSelector={pageSelector} />
        )}
      </InventoryWrapper>
      {!isMobile && (
        <KreadContainer height={height} width={width}>
          <KreadIcon />
        </KreadContainer>
      )}
    </BaseRoute>
  );
};
