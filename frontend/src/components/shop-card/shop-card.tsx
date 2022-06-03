import { FC } from "react";
import { Item } from "../../interfaces";

import { text } from "../../assets";
import { color } from "../../design";
import { Badge, BoldLabel, Label, TitleText } from "../atoms";
import { PriceInRun } from "../price-in-run";

import {
  Product,
  Content,
  ImageContainer,
  Footer,
  Tag,
  TitleWrapper,
  OwnedByContainer,
  ItemImage,
} from "./styles";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { DetailSection } from "../../containers/detail-section";

interface ShopCardProps {
  item: Item;
}

export const ShopCard: FC<ShopCardProps> = ({ item }) => {
  const navigate = useNavigate();
  return (
    <Product onClick={() => <DetailSection />}>
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
            <Badge><Label>{item.category}</Label></Badge>
            <Label>{text.param.oneOutOf(item.rarity)}</Label>
          </Tag>
          <PriceInRun price={item.price} />
        </Footer>
      </Content>
    </Product>
  );
};
