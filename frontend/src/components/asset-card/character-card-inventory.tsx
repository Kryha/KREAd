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
import { BaseCharacter } from "../base-character";
import { text } from "../../assets";
import { routes } from "../../navigation";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  extendedCharacter: ExtendedCharacter;
  onClick?: (assetId: number) => void;
  imageProps?: ImageProps;
}

export const CharacterCardInventory: FC<Props> = ({ extendedCharacter, onClick }) => {
  const { nft: character } = extendedCharacter;
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    onClick && onClick(character.id);
  };

  const sellAsset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate(`${routes.sellCharacter}/${character.id}`, { state: location });
  };

  return (
    <AssetWrapper onClick={() => handleClick()}>
      <AssetContent>
        <AssetImageContainer>
          {character.image ? (
            <BaseCharacter characterImage={character.image} items={extendedCharacter.equippedItems} isZoomed={false} size="medium" />
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
              <LevelBoldLabel customColor={color.black}>{character.level}</LevelBoldLabel>
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
