import { ExtendedCharacter } from "../../interfaces";
import { Badge, BoldLabel, ButtonText, ImageProps, LevelBoldLabel, PrimaryButton } from "../atoms";
import React, { FC } from "react";
import {
  AssetContent,
  AssetFooter,
  AssetImageContainer,
  AssetInfoContainer,
  AssetStatsContainer,
  AssetTag,
  AssetTitleText,
  AssetTitleWrapper,
  AssetWrapper,
  NoAssetImage,
} from "./styles";
import { color } from "../../design";
import { text } from "../../assets";
import { routes } from "../../navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateCharacterLevels } from "../../util";
import { BaseCharacterCanvas } from "../base-character-canvas/base-character-canvas";
import { useParentViewport } from "../../hooks/use-parent-viewport";

interface Props {
  extendedCharacter: ExtendedCharacter;
  onClick?: (assetId: number) => void;
  imageProps?: ImageProps;
}

export const CharacterCardInventory: FC<Props> = ({ extendedCharacter, onClick }) => {
  const { nft: character, equippedItems } = extendedCharacter;
  const navigate = useNavigate();
  const location = useLocation();
  const { parentRef, parentWidth, parentHeight } = useParentViewport();

  const handleClick = () => {
    onClick && onClick(character.id);
  };

  const sellAsset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate(`${routes.sellCharacter}/${character.id}`, { state: location });
  };

  const { totalLevel } = calculateCharacterLevels({
    nft: character,
    equippedItems,
  });

  return (
    <AssetWrapper onClick={() => handleClick()}>
      <AssetContent>
        <AssetImageContainer ref={parentRef}>
          {character ? (
            <BaseCharacterCanvas width={parentWidth} height={parentHeight} character={character} items={extendedCharacter.equippedItems} />
          ) : (
            <NoAssetImage />
          )}
        </AssetImageContainer>
        <AssetInfoContainer>
          <AssetTitleWrapper>
            <AssetTitleText>{character.name}</AssetTitleText>
            <BoldLabel>{character.title}</BoldLabel>
          </AssetTitleWrapper>
          <AssetStatsContainer>
            <AssetTag>
              <BoldLabel customColor={color.black}>lvl. </BoldLabel>
              <LevelBoldLabel customColor={color.black}>{totalLevel}</LevelBoldLabel>
            </AssetTag>
            <Badge>
              <ButtonText>{character.origin}</ButtonText>
            </Badge>
          </AssetStatsContainer>
          <AssetFooter>
            <PrimaryButton onClick={(event) => sellAsset(event)}>
              <ButtonText customColor={color.white}>{text.general.sell}</ButtonText>
            </PrimaryButton>
          </AssetFooter>
        </AssetInfoContainer>
      </AssetContent>
    </AssetWrapper>
  );
};
