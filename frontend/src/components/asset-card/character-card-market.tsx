import { CharacterInMarket } from "../../interfaces";
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
import { routes } from "../../navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { PriceContainer } from "../price-in-ist/styles";
import { PriceInIst } from "../price-in-ist";
import { text } from "../../assets";
import { calculateCharacterLevels } from "../../util";

interface Props {
  characterInMarket: CharacterInMarket;
  onClick?: (assetId: number) => void;
  imageProps?: ImageProps;
}

export const CharacterCardMarket: FC<Props> = ({ characterInMarket, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { character, equippedItems } = characterInMarket;

  const { totalLevel } = calculateCharacterLevels({
    nft: character,
    equippedItems,
  });

  const handleClick = () => {
    onClick && onClick(character.id);
  };

  const buyAsset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate(`${routes.buyCharacter}/${character.id}`, { state: location });
  };

  const { price, platformFee, royalty } = characterInMarket.sell;

  const totalPrice = Number(price + platformFee + royalty);

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
            <PriceContainer>
              <PriceInIst price={totalPrice} />
              <PrimaryButton onClick={(event) => buyAsset(event)}>
                <ButtonText customColor={color.white}>{text.general.buy}</ButtonText>
              </PrimaryButton>
            </PriceContainer>
          </AssetFooter>
        </AssetInfoContainer>
      </AssetContent>
      {/* TODO: figure out if we want to use this label for something */}
      {/*extendedCharacter. && <BoldLabel customColor={color.black}>{text.general.forSale}</BoldLabel>*/}
    </AssetWrapper>
  );
};
