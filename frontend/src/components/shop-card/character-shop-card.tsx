import { FC } from "react";

import { Character } from "../../interfaces";
import { text } from "../../assets";
import { color } from "../../design";
import { Badge, BoldLabel, Label, TitleText } from "../atoms";
import { PriceInRun } from "../price-in-run";
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
import { useViewport } from "../../hooks";

interface CharacterShopCardProps {
  character: Character;
  onClick?: (character: Character) => void;
}

export const CharacterShopCard: FC<CharacterShopCardProps> = ({ character, onClick }) => {
  const { width } = useViewport();

  return (
    <Product onClick={() => onClick && onClick(character)} width={width}>
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
          <PriceInRun price={character.price} />
        </Footer>
      </Content>
    </Product>
  );
};
