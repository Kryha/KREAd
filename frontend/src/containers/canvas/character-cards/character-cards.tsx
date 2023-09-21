import React, { FC, useEffect, useMemo } from "react";
import { BaseCharacter, ButtonText, HorizontalDivider, PrimaryButton, SecondaryButton } from "../../../components";
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
import { useNavigate } from "react-router-dom";
import { ButtonInfoWrap } from "../../../components/button-info/styles";

export const CharacterCards: FC = () => {
  const { selectedAssetCategory, selectedAsset, setOnAssetChange, setSelectedAsset } = useCharacterBuilder();

  const { height } = useViewport();
  const navigate = useNavigate();
  const [selectedCharacter] = useSelectedCharacter();

  const [characters] = useMyCharacters();

  const userStateDispatch = useUserStateDispatch();

  const select = (character: ExtendedCharacter) => {
    if (!character) return;
    userStateDispatch({ type: "SET_SELECTED", payload: character });
  };

  const sell = (character: ExtendedCharacter) => {
    if (!character) return;
    navigate(`${routes.sellCharacter}/${character.nft.id}`);
  };

  useEffect(() => {
    if (selectedCharacter) {
      setSelectedAsset(selectedCharacter.nft.name);
    }
  }, [selectedCharacter, setSelectedAsset]);

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => character.nft.name !== selectedCharacter?.nft.name);
  }, [characters, selectedCharacter]);

  const itemsCount = filteredCharacters.length;

  return (
    <CharacterCardsContainer>
      <AssetFilterCount customColor={color.darkGrey}>Selected Character</AssetFilterCount>
      <HorizontalDivider />
      {selectedCharacter ? (
        <CharacterCardContainer
          isSelected={selectedAsset === selectedCharacter.nft.name}
          onClick={() => {
            setSelectedAsset(selectedCharacter.nft.name);
            setOnAssetChange(false);
          }}
        >
          <ImageCard>
            {/*//TODO: items not showing on character card*/}
            <BaseCharacter
              characterImage={selectedCharacter.nft.image}
              items={selectedCharacter.equippedItems}
              isZoomed={false}
              size="mini"
            />
          </ImageCard>
          <CharacterInformation character={selectedCharacter} selectedCharacterName={selectedCharacter?.nft.name} />
        </CharacterCardContainer>
      ) : null}
      {/* FIXME: wrong type */}
      {/* <AssetFilterCount customColor={color.darkGrey}>
        {itemsCount} {text.param.assetCategories[selectedAssetCategory]} in inventory
      </AssetFilterCount> */}
      <HorizontalDivider />
      <CharacterCardsWrapper height={height}>
        {filteredCharacters.map((character, index) => (
          <CharacterCardContainer
            key={index}
            isSelected={selectedAsset === character.nft.name}
            onClick={() => {
              setSelectedAsset(character.nft.name);
              setOnAssetChange(true);
            }}
          >
            <ImageCard>
              <BaseCharacter characterImage={character.nft.image} items={character.equippedItems} isZoomed={false} size="mini" />
            </ImageCard>
            <CharacterInformation
              character={character}
              selectCharacter={select}
              sell={sell}
              selectedCharacterName={selectedCharacter?.nft.name}
            />
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
  selectedCharacterName?: string;
  selectCharacter?: (character: ExtendedCharacter) => void;
}
const CharacterInformation: FC<CharacterInfo> = ({ character, sell, selectCharacter, selectedCharacterName }) => {
  const { setShowDetails } = useCharacterBuilder();
  return (
    <CharacterInfo>
      <ButtonText customColor={color.black}>{character.nft.name}</ButtonText>
      <CharacterInfoCharacter>Title: {character.nft.title}</CharacterInfoCharacter>
      <CharacterInfoCharacter>Lvl: {character.nft.level}</CharacterInfoCharacter>
      <CharacterInfoCharacter>Origin: {character.nft.origin}</CharacterInfoCharacter>
      <CharacterButtonContainer>
        <ButtonInfoWrap onClick={() => setShowDetails(true)}>
          <SecondaryButton>{text.general.info}</SecondaryButton>
        </ButtonInfoWrap>
        {character.nft.name !== selectedCharacterName ? (
          <>
            <PrimaryButton onClick={() => (selectCharacter ? selectCharacter(character) : null)}>
              <ButtonText customColor={color.white}>select</ButtonText>
            </PrimaryButton>
            <PrimaryButton onClick={() => (sell ? sell(character) : null)}>
              <ButtonText customColor={color.white}>Sell</ButtonText>
            </PrimaryButton>
          </>
        ) : null}
      </CharacterButtonContainer>
    </CharacterInfo>
  );
};
