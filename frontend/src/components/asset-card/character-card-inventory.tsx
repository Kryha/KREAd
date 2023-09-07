import { ExtendedCharacter } from "../../interfaces";
import { BoldLabel, Dash, ImageProps } from "../atoms";
import { FC } from "react";
import {
  AssetContent,
  AssetFooter,
  AssetImage,
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
        {character.image && (
          <BaseCharacter characterImage={character.image} items={extendedCharacter.equippedItems} isZoomed={false} size="medium" />
        )}
        <AssetImageContainer>
          {character.image && <AssetImage src={character.image} />}
          {!character.image && <NoAssetImage />}
        </AssetImageContainer>
        <AssetInfoContainer>
          <AssetTitleWrapper>
            <AssetTitleText>{character.name}</AssetTitleText>
            {/* <BoldLabel>{text.param.categories[character.category]}</BoldLabel> */}
          </AssetTitleWrapper>
          <AssetFooter>
            <AssetTag>
              <BoldLabel customColor={color.black}>{text.param.level(character.level)}</BoldLabel>
              {character.rarity && (
                <>
                  <Dash />
                  <BoldLabel customColor={color.black}>{text.param.rarity(character.rarity)}</BoldLabel>
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
