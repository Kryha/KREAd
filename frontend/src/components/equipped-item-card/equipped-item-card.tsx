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
  category: string;
}

export const LeftEquippedItemCard: FC<EquippedItemCardProps> =
({ item, code, width, height, marginTop, marginBottom, marginLeft, marginRight, category }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`${routes.items}/${category}`, { state: { category: category} });
  };
  return (
    <EquippedContainer
      onClick={() => handleClick()}>
      <VerticalInfo code={code} id={item?.id} />
      <ItemCard
        image={item?.image}
        width={width}
        height={height}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight}
      />
    </EquippedContainer>
  );
};

export const RightEquippedItemCard: FC<EquippedItemCardProps> =
({ item, code, width, height, marginTop, marginBottom, marginLeft, marginRight, category }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`${routes.items}/${category}`, { state: { category: category } });
  };
  return (
    <EquippedContainer
      onClick={() => handleClick()}>
      <ItemCard
        image={item?.image}
        width={width}
        height={height}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight} />
      <VerticalInfo code={code} id={item?.id} isRight />
    </EquippedContainer>
  );
};
