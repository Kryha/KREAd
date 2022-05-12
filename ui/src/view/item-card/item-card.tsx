import { FC } from "react";
import { ElementContainer, Image, ItemWrapper } from "./styles";

interface ItemCardProps {
  image: string;
}

export const ItemCard: FC<ItemCardProps> = ({ image }) => {
  return (
    <ElementContainer>
      <ItemWrapper>
        <Image src={image} />
      </ItemWrapper>
    </ElementContainer>
  );
}
