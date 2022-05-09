import { FC } from "react";
import { Diagonal, ElementContainer, Image, ItemWrapper, NoImage } from "./styles";

interface ItemCardProps {
  image: string | undefined;
}

export const ItemCard: FC<ItemCardProps> = ({ image }) => {
  return (
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
  );
}
