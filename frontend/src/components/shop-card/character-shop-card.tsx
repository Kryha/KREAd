import { FC } from "react";

import { Character, isCharacterCategory } from "../../interfaces";
import { text } from "../../assets";
import { color } from "../../design";
import { BoldLabel, ButtonText, PrimaryButton, TitleText } from "../atoms";
import { PriceInIst } from "../price-in-ist";
import { BaseCharacter } from "../base-character";
import { Content, ImageContainer, Product, Element, TitleWrapper, Footer, Tag, PriceContainer, InfoContainer } from "./styles";
import { useViewport } from "../../hooks";

interface CharacterShopCardProps {
  character: Character;
  onClick?: (character: Character) => void;
}

export const CharacterShopCard: FC<CharacterShopCardProps> = ({ character, onClick }) => {
  const { width, height } = useViewport();
  if (!isCharacterCategory(character.type)) return <></>;

  return (
    <Product onClick={() => onClick && onClick(character)} width={width} height={height}>
      <Content>
        <ImageContainer>
          <Element />
          <BaseCharacter characterImage={character.image} items={character.items} isZoomed={false} size="medium" />
        </ImageContainer>
        <InfoContainer>
          <TitleWrapper>
            <TitleText>{character.name}</TitleText>
            <BoldLabel>{text.param.categories[character.type]}</BoldLabel>
          </TitleWrapper>
          <Footer>
            <Tag>
              <BoldLabel customColor={color.black}>{text.param.level(character.level)}</BoldLabel>
            </Tag>
            <PriceContainer>
              {/* TODO: add price*/}
              <PriceInIst price={4/*character.price*/} />
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
