import { FC } from "react";

import { Item } from "../../interfaces";
import { text } from "../../assets";
import { color } from "../../design";
import { Badge, BoldLabel, ButtonText, Label, PrimaryButton, TitleText } from "../atoms";
import { PriceInIst } from "../price-in-ist";
import { Product, Content, ImageContainer, Footer, Tag, TitleWrapper, OwnedByContainer, ItemImage, Line } from "./styles";
import { useViewport } from "../../hooks";

interface ShopCardProps {
  item: Item;
  onClick?: (item: Item) => void;
}

export const ItemShopCard: FC<ShopCardProps> = ({ item, onClick }) => {
  const { width, height } = useViewport();
  const handleClick = () => {
    if (!onClick) return;
    onClick(item);
  };

  return (
    <Product onClick={() => handleClick()} width={width} height={height}>
      <Content>
        <ImageContainer>
          {/* TODO: use slots */}
          <ItemImage src={item.image} category={item.category} />
        </ImageContainer>
        <TitleWrapper>
          <TitleText>{item.name}</TitleText>
          <BoldLabel>{item.category}</BoldLabel>
        </TitleWrapper>
        <Footer>
          <Tag>
            <BoldLabel customColor={color.black}>{text.param.level(item.level)}</BoldLabel>
          </Tag>
          <PriceInIst price={item.price} />
          <PrimaryButton>
            <ButtonText customColor={color.white}>{text.general.buy}</ButtonText>
          </PrimaryButton>
        </Footer>
      </Content>
    </Product>
  );
};
