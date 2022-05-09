import { Item } from "@agoric/types";
import { FC } from "react";
import { ItemCard } from "../item-card";
import { VerticalInfo } from "../vertical-info";
import { EquippedContainer } from "./styles";

interface EquippedItemCardProps {
  item: Item | undefined;
  code: string;
};

export const LeftEquippedItemCard: FC<EquippedItemCardProps> = ({ item, code }) => {
  return (
    <EquippedContainer>
      <VerticalInfo code={code} id={item?.id} />
      <ItemCard image={item?.image} />
    </EquippedContainer>
  );
};

export const RightEquippedItemCard: FC<EquippedItemCardProps> = ({ item, code }) => {
  return (
    <EquippedContainer>
      <ItemCard image={item?.image} />
      <VerticalInfo code={code} id={item?.id} isRight />
    </EquippedContainer>
  );
};
