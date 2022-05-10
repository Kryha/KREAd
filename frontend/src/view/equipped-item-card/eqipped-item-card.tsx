import { Item } from "@agoric/types";
import { FC } from "react";
import { ItemCard } from "../item-card";
import { VerticalInfo } from "../vertical-info";
import { EquippedContainer } from "./styles";

interface EquippedItemCardProps {
  item: Item | undefined;
  code: string;
  width?: string;
  height?: string;
  marginTop?: string | undefined;
  marginLeft?: string | undefined;
  marginRight?: string | undefined;
  marginBottom?: string | undefined;
};

export const LeftEquippedItemCard: FC<EquippedItemCardProps> = ({ item, code, width, height, marginTop, marginBottom, marginLeft, marginRight }) => {
  return (
    <EquippedContainer>
      <VerticalInfo code={code} id={item?.id} />
      <ItemCard image={item?.image} width={width} height={height} marginTop={marginTop} marginBottom={marginBottom} marginLeft={marginLeft} marginRight={marginRight} />
    </EquippedContainer>
  );
};

export const RightEquippedItemCard: FC<EquippedItemCardProps> = ({ item, code, width, height, marginTop, marginBottom, marginLeft, marginRight }) => {
  return (
    <EquippedContainer>
      <ItemCard image={item?.image} width={width} height={height} marginTop={marginTop} marginBottom={marginBottom} marginLeft={marginLeft} marginRight={marginRight} />
      <VerticalInfo code={code} id={item?.id} isRight />
    </EquippedContainer>
  );
};
