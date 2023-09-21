import { FC } from "react";

import { CharacterInMarket, isCharacterCategory } from "../../interfaces";
import { text } from "../../assets";
import { color } from "../../design";
import { BoldLabel, ButtonText, PrimaryButton, TitleText } from "../atoms";
import { PriceInIst } from "../price-in-ist";
import { BaseCharacter } from "../base-character";
import { Content, Element, Footer, ImageContainer, InfoContainer, PriceContainer, Product, Tag, TitleWrapper } from "./styles";
import { useViewport } from "../../hooks";

interface CharacterShopCardProps {
  character: CharacterInMarket;
  onClick?: (character: CharacterInMarket) => void;
}

export const CharacterShopCard: FC<CharacterShopCardProps> = ({ character, onClick }) => {
  const { width, height } = useViewport();

  if (!isCharacterCategory(character.character.title)) return <></>;

  return (
    <Product onClick={() => onClick && onClick(character)} width={width} height={height}>
      <Content>
        <ImageContainer>
          <Element />
          <BaseCharacter characterImage={character.character.image} items={character.equippedItems} isZoomed={false} size="medium" />
        </ImageContainer>
        <InfoContainer>
          <TitleWrapper>
            <TitleText>{character.character.name}</TitleText>
            <BoldLabel>{text.param.categories[character.character.title]}</BoldLabel>
          </TitleWrapper>
          <Footer>
            <Tag>
              <BoldLabel customColor={color.black}>{text.param.level(character.character.level)}</BoldLabel>
            </Tag>
            <PriceContainer>
              <PriceInIst price={Number(character.sell.price)} />
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
