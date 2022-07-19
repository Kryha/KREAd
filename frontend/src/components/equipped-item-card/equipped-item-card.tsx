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
  area: "top" | "middle" | "bottom";
}

export const LeftEquippedItemCard: FC<EquippedItemCardProps> =
({ item, code, width, height, marginTop, marginBottom, marginLeft, marginRight, category, area }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`${routes.items}/${category}`, { state: { category: category} });
  };
  return (
    <EquippedContainer
      onClick={() => handleClick()}
      isRight={false}
    >
      <VerticalInfo code={code} />
      <ItemCard
        position="left"
        area={area}
        item={item}
        image={item?.thumbnail}
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
({ item, code, width, height, marginTop, marginBottom, marginLeft, marginRight, category, area }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`${routes.items}/${category}`, { state: { category: category } });
  };
  return (
    <EquippedContainer
      onClick={() => handleClick()}
      isRight
      isSecond={code === "noseline" || code === "liquid"}
    >
      <ItemCard
        position="right"
        area={area}
        item={item}
        image={item?.thumbnail}
        width={width}
        height={height}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight} />
      <VerticalInfo code={code} isRight />
    </EquippedContainer>
  );
};
