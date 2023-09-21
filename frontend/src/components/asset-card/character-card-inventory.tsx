import { ExtendedCharacter } from "../../interfaces";
import { BoldLabel, Dash, ImageProps } from "../atoms";
import { FC } from "react";
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

interface Props {
  extendedCharacter: ExtendedCharacter;
  onClick?: (assetId: string) => void;
  imageProps?: ImageProps;
}

export const CharacterCardInventory: FC<Props> = ({ extendedCharacter, onClick }) => {
  const { nft: character } = extendedCharacter;

  const handleClick = () => {
    onClick && onClick(character.id);
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
          <AssetFooter></AssetFooter>
        </AssetInfoContainer>
      </AssetContent>
    </AssetWrapper>
  );
};
