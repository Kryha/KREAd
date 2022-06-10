import { Item } from "../../interfaces";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";

import { ItemCard } from "../item-card";
import { VerticalInfo } from "../vertical-info";
import { EquippedContainer } from "./styles";
import { ItemStats } from "../item-stats";

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
  const [showStats, setShowStats] = useState(false);

  const handleClick = () => {
    navigate(`${routes.items}/${category}`, { state: { category: category} });
  };
  return (
    <>
      <ItemStats item={item} />
      {/* {showStats && <ItemStats item={item} />} */}
      <EquippedContainer
        onClick={() => handleClick()}
        onMouseEnter={() => setShowStats(!showStats)}
        onMouseLeave={() => setShowStats(!showStats)}
      >
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
    </>
  );
};

export const RightEquippedItemCard: FC<EquippedItemCardProps> =
({ item, code, width, height, marginTop, marginBottom, marginLeft, marginRight, category }) => {
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);
  const handleClick = () => {
    navigate(`${routes.items}/${category}`, { state: { category: category } });
  };
  return (
    <>
      {showStats && <ItemStats item={item} />}
      <EquippedContainer
        onClick={() => handleClick()}
        onMouseEnter={() => setShowStats(!showStats)}
        onMouseLeave={() => setShowStats(!showStats)}
      >
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
    </>
  );
};
