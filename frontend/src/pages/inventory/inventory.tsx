import React, { FC } from "react";
import { BaseRoute } from "../../components";
import { InventoryWrapper } from "./styles";
import { ItemsInventory } from "./item-inventory";
import { CharactersInventory } from "./character-inventory";
import { useParams } from "react-router-dom";
import { Section } from "../../constants";
import { InventoryNavbar } from "../../components/inventory-navbar/inventory-navbar";
import { useIsMobile } from "../../hooks";
import { breakpoints } from "../../design";

export const Inventory: FC = () => {
  const { section } = useParams<{ section: Section }>();
  const isMobile = useIsMobile(breakpoints.tablet);

  return (
    <BaseRoute sideNavigation={<></>}>
      {isMobile && <InventoryNavbar />}
      <InventoryWrapper>{section === "items" ? <ItemsInventory /> : <CharactersInventory />}</InventoryWrapper>
    </BaseRoute>
  );
};
