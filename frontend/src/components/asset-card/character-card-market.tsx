import { CharacterInMarket } from "../../interfaces";
import { BoldLabel, ImageProps } from "../atoms";
import { FC } from "react";
import {
  AssetContent,
  AssetFooter,
  AssetImageContainer,
  AssetInfoContainer,
  AssetTag,
  AssetTitleText,
  AssetTitleWrapper,
  AssetWrapper,
  NoAssetImage,
} from "./styles";
import { text } from "../../assets";
import { color } from "../../design";
import { BaseCharacter } from "../base-character";

interface Props {
  characterInMarket: CharacterInMarket;
  onClick?: (assetId: number) => void;
  imageProps?: ImageProps;
}

export const CharacterCardMarket: FC<Props> = ({ characterInMarket, onClick }) => {
  const { character } = characterInMarket;

  const handleClick = () => {
    onClick && onClick(character.id);
  };

  return (
    <AssetWrapper onClick={() => handleClick()}>
      <AssetContent>
        <AssetImageContainer>
          {character.image ? (
            <BaseCharacter characterImage={character.image} items={characterInMarket.equippedItems} isZoomed={false} size="medium" />
          ) : (
            <NoAssetImage />
          )}
        </AssetImageContainer>
        <AssetInfoContainer>
          <AssetTitleWrapper>
            <AssetTitleText>{character.name}</AssetTitleText>
          </AssetTitleWrapper>
          <AssetFooter>
            <AssetTag>
              <BoldLabel customColor={color.black}>{text.param.level(character.level)}</BoldLabel>
            </AssetTag>
            {/* TODO: figure out if we want to use this label for something */}
            {/*extendedCharacter. && <BoldLabel customColor={color.black}>{text.general.forSale}</BoldLabel>*/}
          </AssetFooter>
        </AssetInfoContainer>
      </AssetContent>
    </AssetWrapper>
  );
};
