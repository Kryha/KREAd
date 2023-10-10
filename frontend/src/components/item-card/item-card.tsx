import { FC } from "react";
import { Item } from "../../interfaces";
import { ImageProps, Img } from "../atoms";
import {
  Diagonal,
  DiagonalContainer,
  ElementContainer,
  ElementWrapper,
  ItemCardWrapper,
  ItemWrapper,
  NoImage,
  Plus,
  PlusContainer,
} from "./styles";

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
        <ItemWrapper>
          <NoImage>
            <DiagonalContainer>
              <Diagonal />
            </DiagonalContainer>
          </NoImage>
        </ItemWrapper>
      </ElementContainer>
    </ElementWrapper>
  );
};

export const ItemCard: FC<ItemCardProps> = ({ image, width, height }) => {
  return (
    <ItemCardWrapper>
      <ElementWrapper>
        <ElementContainer>
          <ItemWrapper>
            {image ? (
              <Img src={image} width={width} height={height} />
            ) : (
              <NoImage>
                <PlusContainer>
                  <Plus />
                </PlusContainer>
                <DiagonalContainer>
                  <Diagonal />
                </DiagonalContainer>
              </NoImage>
            )}
          </ItemWrapper>
        </ElementContainer>
      </ElementWrapper>
    </ItemCardWrapper>
  );
};
