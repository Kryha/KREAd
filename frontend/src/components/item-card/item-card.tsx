import { FC, useState } from "react";
import { imageSize } from "../../design";
import { Item } from "../../interfaces";
import { ImageProps, Img } from "../atoms";
import { ItemStats } from "../item-stats";
import {
  Diagonal,
  ElementWrapper,
  ElementContainer,
  ItemWrapper,
  NoImage,
  Card,
} from "./styles";
interface ItemCardProps extends ImageProps {
  image?: string;
  item?: Item;
  position?: "left" | "right";
  area?: "top" | "middle" | "bottom";
}

export const ItemCard: FC<ItemCardProps> = ({ image, width, height, marginTop, marginBottom, marginLeft, marginRight, item, position = "left", area ="middle" }) => {
  const [showStats, setShowStats] = useState(false);
  return (
    <>
      {showStats && !!item &&
        <ItemStats
          item={item}
          position={position}
          area={area}
        />
      }
      <ElementWrapper
        onMouseEnter={() => setShowStats(!showStats)}
        onMouseLeave={() => setShowStats(!showStats)}
      >
        <Card />
        <ElementContainer>
          <ItemWrapper>
            {image ?(
              <Img
                src={image}
                width={width || imageSize.medium}
                height={height || imageSize.small}
                marginTop={marginTop}
                marginBottom={marginBottom}
                marginLeft={marginLeft}
                marginRight={marginRight}
              />
            ) : (
              <NoImage>
                <Diagonal />
              </NoImage>
            )}
          </ItemWrapper>
        </ElementContainer>
      </ElementWrapper>
    </>
  );
};
