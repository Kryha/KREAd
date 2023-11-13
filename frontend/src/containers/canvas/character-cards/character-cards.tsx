import React, { FC, useEffect } from "react";
import { BoldLabel, ButtonText, LevelBoldLabel, SecondaryButton } from "../../../components";
import { color } from "../../../design";
import { useViewport } from "../../../hooks";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { AssetFilterCount } from "../../../components/asset-item-filters/styles";
import { text } from "../../../assets";
import { ImageCard } from "../../../components/character-item/styles";
import { ExtendedCharacter } from "../../../interfaces";
import {
  CharacterButtonContainer,
  CharacterCardContainer,
  CharacterCardsContainer,
  CharacterCardsWrapper,
  CharacterInfo,
  CharacterInfoCharacter,
} from "./styles";
import { useMyCharacters, useSelectedCharacter } from "../../../service";
import { useUserStateDispatch } from "../../../context/user";
import { ButtonInfoWrap } from "../../../components/button-info/styles";
import { BaseCharacterCanvas } from "../../../components/base-character-canvas/base-character-canvas";
import { useParentViewport } from "../../../hooks/use-parent-viewport";
import { calculateCharacterLevels } from "../../../util";
import { AssetTag } from "../../../components/asset-card/styles";

export const CharacterCards: FC = () => {
  const { selectedAsset, setSelectedAsset } = useCharacterBuilder();
  const { height } = useViewport();
  const { parentRef, parentWidth, parentHeight } = useParentViewport();
  const [selectedCharacter] = useSelectedCharacter();

  const [characters] = useMyCharacters();

  const userStateDispatch = useUserStateDispatch();

  const select = (character: ExtendedCharacter) => {
    if (!character) return;
    userStateDispatch({ type: "SET_SELECTED", payload: character.nft.name });
  };

  useEffect(() => {
    if (selectedCharacter) {
      setSelectedAsset(selectedCharacter.nft.name);
    }
  }, [selectedCharacter, setSelectedAsset]);

  const charactersCount = characters.length;

  return (
    <CharacterCardsContainer>
      <AssetFilterCount customColor={color.darkGrey}>{text.param.amountOfCharacters(charactersCount)} in inventory</AssetFilterCount>
      <CharacterCardsWrapper height={height}>
        {characters.map((character, index) => (
          <CharacterCardContainer
            key={index}
            isSelected={selectedAsset === character.nft.name}
            onClick={() => {
              setSelectedAsset(character.nft.name);
              select(character);
            }}
          >
            <ImageCard ref={parentRef}>
              <BaseCharacterCanvas width={parentWidth} height={parentHeight} character={character.nft} items={character.equippedItems} />
            </ImageCard>
            <CharacterInformation character={character} />
          </CharacterCardContainer>
        ))}
      </CharacterCardsWrapper>
    </CharacterCardsContainer>
  );
};

// TODO: Add the conditions for swapping items if the item is equipped to the character

interface CharacterInfo {
  character: ExtendedCharacter;
}
const CharacterInformation: FC<CharacterInfo> = ({ character }) => {
  const { setShowDetails } = useCharacterBuilder();
  const { totalLevel } = calculateCharacterLevels(character);

  return (
    <CharacterInfo>
      <ButtonText customColor={color.black}>{character.nft.name}</ButtonText>
      <CharacterInfoCharacter>Title: {character.nft.title}</CharacterInfoCharacter>
      <CharacterInfoCharacter>Origin: {character.nft.origin}</CharacterInfoCharacter>
      <AssetTag>
        <BoldLabel>lvl. </BoldLabel>
        <LevelBoldLabel>{totalLevel}</LevelBoldLabel>
      </AssetTag>
      <CharacterButtonContainer>
        <ButtonInfoWrap onClick={() => setShowDetails(true)}>
          <SecondaryButton>{text.general.info}</SecondaryButton>
        </ButtonInfoWrap>
      </CharacterButtonContainer>
    </CharacterInfo>
  );
};
