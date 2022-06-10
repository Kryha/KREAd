import { Item } from "../../interfaces";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";

import { ItemCard } from "../item-card";
import { VerticalInfo } from "../vertical-info";
import { EquippedContainer } from "./styles";

interface EquippedItemCardProps {
  item?: Item;
  code: string;
  width?: string;
  height?: string;
  marginTop?: string;
  marginLeft?: string;
  marginRight?: string;
  marginBottom?: string;
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
        item={item}
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
        item={item}
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
