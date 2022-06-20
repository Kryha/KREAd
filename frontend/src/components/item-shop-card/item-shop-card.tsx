import { FC } from "react";

import { Item } from "../../interfaces";
import { text } from "../../assets";
import { color } from "../../design";
import { Badge, BoldLabel, Label, TitleText } from "../atoms";
import { PriceInRun } from "../price-in-run";
import { Product, Content, ImageContainer, Footer, Tag, TitleWrapper, OwnedByContainer, ItemImage, Line } from "./styles";

interface ShopCardProps {
  item: Item;
  onClick?: (item: Item) => void;
}

export const ItemShopCard: FC<ShopCardProps> = ({ item, onClick }) => {
  const handleClick = () => {
    if (!onClick) return;
    onClick(item);
  };

  return (
    <Product onClick={() => handleClick()}>
      <Content>
        <ImageContainer>
          {/* TODO: use slots */}
          <ItemImage src={item.image} category={item.category} />
        </ImageContainer>
        <TitleWrapper>
          <TitleText>{item.name}</TitleText>
          <OwnedByContainer>
            <BoldLabel customColor={color.black}>{text.param.itemId(item.id)}</BoldLabel>
          </OwnedByContainer>
        </TitleWrapper>
        <Footer>
          <Tag>
            <Badge>
              <Label>{item.category}</Label>
            </Badge>
            <Line />
            <BoldLabel customColor={color.black}>{text.param.level(item.level)}</BoldLabel>
          </Tag>
          <PriceInRun price={item.price} />
        </Footer>
      </Content>
    </Product>
  );
};
