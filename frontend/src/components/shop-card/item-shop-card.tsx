import { FC } from "react";

import { Item } from "../../interfaces";
import { text } from "../../assets";
import { color } from "../../design";
import { BoldLabel, ButtonText, PrimaryButton, TitleText } from "../atoms";
import { PriceInIst } from "../price-in-ist";
import { Product, Content, ImageContainer, Footer, Tag, TitleWrapper, ItemImage, InfoContainer, PriceContainer } from "./styles";
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
          <ItemImage src={item.thumbnail} category={item.category} />
        </ImageContainer>
        <InfoContainer>
          <TitleWrapper>
            <TitleText>{item.name}</TitleText>
            <BoldLabel>{item.category}</BoldLabel>
          </TitleWrapper>
          <Footer>
            <Tag>
              <BoldLabel customColor={color.black}>{text.param.level(item.level)}</BoldLabel>
            </Tag>
            <PriceContainer>
              <PriceInIst price={item.price} />
              <PrimaryButton>
                <ButtonText customColor={color.white}>{text.general.buy}</ButtonText>
              </PrimaryButton>
            </PriceContainer>
          </Footer>
        </InfoContainer>
      </Content>
    </Product>
  );
};
