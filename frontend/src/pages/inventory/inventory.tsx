import React, { FC, useMemo } from "react";
import { BaseRoute, SwitchSelector } from "../../components";
import { text } from "../../assets";
import { InventoryWrapper, KreadContainer } from "./styles";
import { ItemsInventory } from "./item-inventory";
import { CharactersInventory } from "./character-inventory";
import { useIsMobile, useViewport } from "../../hooks";
import { KreadIcon } from "../../components/logo/styles";
import { breakpoints } from "../../design";
import { useLocation, useParams } from "react-router-dom";
import { Section } from "../../constants";

export const Inventory: FC = () => {
  const { width, height } = useViewport();
  const isMobile = useIsMobile(breakpoints.desktop);
  const { pathname } = useLocation();
  const { section } = useParams<{ section: Section }>();

  const pageSelector = useMemo(
    () => (
      <SwitchSelector
        buttonOneText={text.character.items}
        buttonTwoText={text.character.characters}
        selectedSection={section || "items"}
        path={pathname}
      />
    ),
    [pathname, section],
  );

  return (
    <BaseRoute sideNavigation={<></>}>
      <InventoryWrapper>
        {section === "items" ? <ItemsInventory pageSelector={pageSelector} /> : <CharactersInventory pageSelector={pageSelector} />}
      </InventoryWrapper>
      {!isMobile && (
        <KreadContainer height={height} width={width}>
          <KreadIcon />
        </KreadContainer>
      )}
    </BaseRoute>
  );
};
