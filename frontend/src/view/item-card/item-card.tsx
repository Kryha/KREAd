import { FC } from "react";
import {
  Diagonal,
  ElementWrapper,
  ElementContainer,
  Image,
  ItemWrapper,
  NoImage,
  Card
} from "./styles";
interface ItemCardProps {
  image: string | undefined;
}

export const ItemCard: FC<ItemCardProps> = ({ image }) => {
  return (
    <ElementWrapper>
      <Card />
      <ElementContainer>
        <ItemWrapper>
          {image ?
            <Image src={image} />
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
