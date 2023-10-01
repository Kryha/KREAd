import React, { FC } from "react";
import { BaseRoute } from "../../components";
import { InventoryWrapper } from "./styles";
import { ItemsInventory } from "./item-inventory";
import { CharactersInventory } from "./character-inventory";
import { useParams } from "react-router-dom";
import { Section } from "../../constants";

export const Inventory: FC = () => {
  const { section } = useParams<{ section: Section }>();

  return (
    <BaseRoute sideNavigation={<></>}>
      <InventoryWrapper>{section === "items" ? <ItemsInventory /> : <CharactersInventory />}</InventoryWrapper>
    </BaseRoute>
  );
};
