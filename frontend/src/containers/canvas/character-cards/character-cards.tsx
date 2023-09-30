import React, { FC, useEffect } from "react";
import { ButtonText, PrimaryButton, SecondaryButton } from "../../../components";
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
import { routes } from "../../../navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { ButtonInfoWrap } from "../../../components/button-info/styles";
import { BaseCharacterCanvas } from "../../../components/base-character-canvas/base-character-canvas";
import { useParentViewport } from "../../../hooks/use-parent-viewport";
import { calculateCharacterLevels } from "../../../util";

export const CharacterCards: FC = () => {
  const { selectedAsset, setOnAssetChange, setSelectedAsset } = useCharacterBuilder();
  const { height } = useViewport();
  const { parentRef, parentWidth, parentHeight } = useParentViewport();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCharacter] = useSelectedCharacter();

  const [characters] = useMyCharacters();

  const userStateDispatch = useUserStateDispatch();

  const select = (character: ExtendedCharacter) => {
    if (!character) return;
    userStateDispatch({ type: "SET_SELECTED", payload: character.nft.name });
  };

  const sell = (character: ExtendedCharacter) => {
    if (!character) return;
    navigate(`${routes.sellCharacter}/${character.nft.id}`, {
      state: location,
    });
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
              setOnAssetChange(true);
              select(character);
            }}
          >
            <ImageCard ref={parentRef}>
              <BaseCharacterCanvas width={parentWidth} height={parentHeight} character={character.nft} items={character.equippedItems} />
            </ImageCard>
            <CharacterInformation character={character} sell={sell} />
          </CharacterCardContainer>
        ))}
      </CharacterCardsWrapper>
    </CharacterCardsContainer>
  );
};

// TODO: Add the conditions for swapping items if the item is equipped to the character

interface CharacterInfo {
  character: ExtendedCharacter;
  sell?: (character: ExtendedCharacter) => void;
}
const CharacterInformation: FC<CharacterInfo> = ({ character, sell }) => {
  const { setShowDetails } = useCharacterBuilder();
  const { totalLevel } = calculateCharacterLevels(character);

  return (
    <CharacterInfo>
      <ButtonText customColor={color.black}>{character.nft.name}</ButtonText>
      <CharacterInfoCharacter>Title: {character.nft.title}</CharacterInfoCharacter>
      <CharacterInfoCharacter>Lvl: {totalLevel}</CharacterInfoCharacter>
      <CharacterInfoCharacter>Origin: {character.nft.origin}</CharacterInfoCharacter>
      <CharacterButtonContainer>
        <ButtonInfoWrap onClick={() => setShowDetails(true)}>
          <SecondaryButton>{text.general.info}</SecondaryButton>
        </ButtonInfoWrap>
        <PrimaryButton onClick={() => (sell ? sell(character) : null)}>
          <ButtonText customColor={color.white}>sell</ButtonText>
        </PrimaryButton>
      </CharacterButtonContainer>
    </CharacterInfo>
  );
};
