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
  marginTop?: string | undefined;
  marginLeft?: string | undefined;
  marginRight?: string | undefined;
  marginBottom?: string | undefined;
}

export const ItemCard: FC<ItemCardProps> = ({ image, width, height, marginTop, marginBottom, marginLeft, marginRight }) => {
  return (
    <ElementWrapper>
      <Card />
      <ElementContainer>
        <ItemWrapper>
          {image ?
            <Img
              src={image}
              width={width || imageSize.medium}
              height={height || imageSize.small}
              marginTop={marginTop}
              marginBottom={marginBottom}
              marginLeft={marginLeft}
              marginRight={marginRight} />
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
