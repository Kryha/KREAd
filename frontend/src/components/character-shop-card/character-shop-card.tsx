import { FC } from "react";

import { Character } from "../../interfaces";
import { text } from "../../assets";
import { color } from "../../design";
import { BoldLabel, TitleText } from "../atoms";
import { PriceInRun } from "../price-in-run";
import { Product, Content, ImageContainer, Footer, TitleWrapper, OwnedByContainer, Element } from "./styles";
import { BaseCharacter } from "../base-character";

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
            <BoldLabel customColor={color.black}>{text.param.itemId(character.characterId)}</BoldLabel>
          </OwnedByContainer>
        </TitleWrapper>
        <Footer>
          <PriceInRun price={character.price} />
        </Footer>
      </Content>
    </Product>
  );
};
