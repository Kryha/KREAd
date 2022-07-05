import { FC } from "react";

import { Character } from "../../interfaces";
import { text } from "../../assets";
import { color } from "../../design";
import { Badge, BoldLabel, ButtonText, Label, PrimaryButton, TitleText } from "../atoms";
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
import { useViewport } from "../../hooks";

interface CharacterShopCardProps {
  character: Character;
  onClick?: (character: Character) => void;
}

export const CharacterShopCard: FC<CharacterShopCardProps> = ({ character, onClick }) => {
  const { width, height } = useViewport();
  return (
    <Product onClick={() => onClick && onClick(character)} width={width} height={height}>
      <Content>
        <ImageContainer>
          <Element />
          <BaseCharacter items={character.items} isZoomed={false} size="medium" />
        </ImageContainer>
        <TitleWrapper>
          <TitleText>{character.name}</TitleText>
          <BoldLabel>{character.type}</BoldLabel>
        </TitleWrapper>
        <Footer>
          <Tag>
            <BoldLabel customColor={color.black}>{text.param.level(character.level)}</BoldLabel>
          </Tag>
          <PriceInIst price={character.price} />
          <PrimaryButton>
            <ButtonText customColor={color.white}>{text.general.buy}</ButtonText>
          </PrimaryButton>
        </Footer>
      </Content>
    </Product>
  );
};
