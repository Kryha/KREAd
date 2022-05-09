import { FC } from "react";
import { imageSize } from "../../design";
import { Img } from "../atoms";
import {
  Diagonal,
  ElementWrapper,
  ElementContainer,
  ItemWrapper,
  NoImage,
  Card,
} from "./styles";
interface ItemCardProps {
  image: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
}

export const ItemCard: FC<ItemCardProps> = ({ image, width, height }) => {
  return (
    <ElementWrapper>
      <Card />
      <ElementContainer>
        <ItemWrapper>
          {image ?
            <Img src={image} width={imageSize.medium} height={imageSize.small} />
            :
            <NoImage>
              <Diagonal />
            </NoImage>
          }
        </ItemWrapper>
      </ElementContainer>
    </ElementWrapper>
  );
}
