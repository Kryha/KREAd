import { FC } from "react";
import { Character } from "../../interfaces";

import { text } from "../../assets";
import { color } from "../../design";
import { BoldLabel, TitleText } from "../atoms";
import { PriceInRun } from "../price-in-run";

import {
  Product,
  Content,
  ImageContainer,
  Footer,
  TitleWrapper,
  OwnedByContainer,
} from "./styles";
import { BaseCharacter } from "../base-character";

interface CharacterShopCardProps {
  character: Character;
}

export const CharacterShopCard: FC<CharacterShopCardProps> = ({ character }) => {
  return (
    <Product>
      <Content>
        <ImageContainer>
          <BaseCharacter character={character} isZoomed={false} size="medium" />
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
