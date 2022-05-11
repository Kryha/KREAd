import { Item } from "@agoric/types";
import { FC } from "react";
import { ImageProps } from "../atoms";
import { ItemCard } from "../item-card";
import { VerticalInfo } from "../vertical-info";
import { EquippedContainer } from "./styles";

interface EquippedItemCardProps extends ImageProps {
  item: Item | undefined;
  code: string;
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
