import { FC } from "react";
import { Item } from "@agoric/types";

import { text } from "../../assets";
import { color } from "../../design";
import { BoldLabel, Label, TitleText } from "../atoms";
import { PriceInRun } from "../price-in-run";

import {
  Product,
  CharacterImage,
  Content,
  ImageContainer,
  Footer,
  Tag,
  TitleWrapper,
  OwnedByContainer,
} from "./styles";

interface ShopCardProps {
  item: Item;
}

export const ShopCard: FC<ShopCardProps> = ({ item }) => {
  return (
    <Product>
      <Content>
        <ImageContainer>
          <CharacterImage src={item.image} />
        </ImageContainer>
        <TitleWrapper>
          <TitleText>{item.name}</TitleText>
          <OwnedByContainer>
            <BoldLabel customColor={color.black}>{text.param.itemId(item.id)}</BoldLabel>
          </OwnedByContainer>
        </TitleWrapper>
        <Footer>
          <Tag>
            <Label>{item.category}</Label>
            <Label>{text.param.oneOutOf(item.amount)}</Label>
          </Tag>
          <PriceInRun price={item.price} />
        </Footer>
      </Content>
    </Product>
  );
}
