import { FC } from "react";

import { Character } from "../../interfaces";
import { text } from "../../assets";
import { color } from "../../design";
import { Badge, BoldLabel, Label, TitleText } from "../atoms";
import { PriceInIst } from "../price-in-ist";
import { BaseCharacter } from "../base-character";
import {
  Content,
  ImageContainer,
  Product,
  Element,
  TitleWrapper,
  OwnedByContainer,
  Footer,
  Tag,
  Line,
} from "./styles";

interface CharacterShopCardProps {
  character: Character;
  onClick?: (character: Character) => void;
}

export const CharacterShopCard: FC<CharacterShopCardProps> = ({ character, onClick }) => {
  return (
    <Product onClick={() => onClick && onClick(character)}>
      <Content>
        <ImageContainer>
          <Element />
          <BaseCharacter items={character.items} isZoomed={false} size="medium" />
        </ImageContainer>
        <TitleWrapper>
          <TitleText>{character.name}</TitleText>
          <OwnedByContainer>
            <BoldLabel customColor={color.black}>{text.param.id(character.characterId)}</BoldLabel>
          </OwnedByContainer>
        </TitleWrapper>
        <Footer>
          <Tag>
            <Badge>
              <Label>{character.type}</Label>
            </Badge>
            <Line />
            <BoldLabel customColor={color.black}>{text.param.level(character.level)}</BoldLabel>
          </Tag>
          <PriceInIst price={character.price} />
        </Footer>
      </Content>
    </Product>
  );
};
