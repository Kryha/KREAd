import { ExtendedCharacter } from "../../interfaces";
import { BoldLabel, Dash, ImageProps } from "../atoms";
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
  extendedCharacter: ExtendedCharacter;
  onClick?: () => void;
  imageProps?: ImageProps;
}

export const CharacterCardInventory: FC<Props> = ({ extendedCharacter, onClick }) => {
  const { nft: character } = extendedCharacter;

  const handleClick = () => {
    onClick && onClick();
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
          </AssetTitleWrapper>
          <AssetFooter>
            <AssetTag>
              <BoldLabel customColor={color.black}>{character.title}</BoldLabel>
              <BoldLabel customColor={color.black}>{text.param.level(character.level)}</BoldLabel>
              {character.origin && (
                <>
                  <Dash />
                  <BoldLabel customColor={color.black}>{character.origin}</BoldLabel>
                </>
              )}
            </AssetTag>
            {/* TODO: figure out if we cann add this label */}
            {/*extendedCharacter. && <BoldLabel customColor={color.black}>{text.general.forSale}</BoldLabel>*/}
          </AssetFooter>
        </AssetInfoContainer>
      </AssetContent>
    </AssetWrapper>
  );
};
