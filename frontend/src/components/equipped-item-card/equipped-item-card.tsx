import { Item } from "../../interfaces";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";

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
  const navigate = useNavigate();
  return (
    <EquippedContainer onClick={() => item ? navigate(`${routes.items}/${item.id}`, { state: { id: item?.id } }) : <></>}>
      <VerticalInfo code={code} id={item?.id} />
      <ItemCard image={item?.image} width={width} height={height} marginTop={marginTop} marginBottom={marginBottom} marginLeft={marginLeft} marginRight={marginRight} />
    </EquippedContainer>
  );
};

export const RightEquippedItemCard: FC<EquippedItemCardProps> = ({ item, code, width, height, marginTop, marginBottom, marginLeft, marginRight }) => {
  const navigate = useNavigate();
  return (
    <EquippedContainer onClick={() => item ? navigate(`${routes.items}/${item.id}`, { state: { id: item?.id } }) : <></>}>
      <ItemCard image={item?.image} width={width} height={height} marginTop={marginTop} marginBottom={marginBottom} marginLeft={marginLeft} marginRight={marginRight} />
      <VerticalInfo code={code} id={item?.id} isRight />
    </EquippedContainer>
  );
};
