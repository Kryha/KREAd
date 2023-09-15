import { FC } from "react";
import { imageSize } from "../../design";
import { Item } from "../../interfaces";
import { ImageProps, Img } from "../atoms";
import { ItemStats } from "../item-stats";
import { Diagonal, ElementWrapper, ElementContainer, ItemWrapper, NoImage, Card, Plus, PlusContainer, ItemCardWrapper } from "./styles";

interface ItemCardProps extends ImageProps {
  image?: string;
  item?: Item;
  position?: "left" | "right";
  area?: "top" | "middle" | "bottom";
}

export const EmptyItemCard = () => {
  return (
    <ElementWrapper>
      <ElementContainer>
        <Card />
        <ItemWrapper>
          <NoImage>
            <Diagonal />
          </NoImage>
        </ItemWrapper>
      </ElementContainer>
    </ElementWrapper>
  );
};

export const ItemCard: FC<ItemCardProps> = ({ image, width, height, item, position = "left", area = "middle" }) => {
  return (
    <ItemCardWrapper>
      <ItemStats item={item} position={position} area={area} />
      <ElementWrapper>
        <Card />
        <ElementContainer>
          <ItemWrapper>
            {image ? (
              <Img src={image} width={width || imageSize.medium} height={height || imageSize.small} />
            ) : (
              <NoImage>
                <PlusContainer>
                  <Plus />
                </PlusContainer>
                <Diagonal />
              </NoImage>
            )}
          </ItemWrapper>
        </ElementContainer>
      </ElementWrapper>
    </ItemCardWrapper>
  );
};
