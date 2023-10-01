import { ItemInMarket } from "../../interfaces";
import { Badge, BoldLabel, ButtonText, ImageProps, LevelBoldLabel, PrimaryButton } from "../atoms";
import React, { FC } from "react";
import {
  AssetContent,
  AssetFooter,
  AssetImage,
  AssetImageContainer,
  AssetInfoContainer,
  AssetStatsContainer,
  AssetTag,
  AssetTitleText,
  AssetTitleWrapper,
  AssetWrapper,
} from "./styles";
import { text } from "../../assets";
import { color } from "../../design";
import { getRarityString } from "../../service";
import { PriceInIst } from "../price-in-ist";
import { PriceContainer } from "../price-in-ist/styles";
import { routes } from "../../navigation";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  itemInMarket: ItemInMarket;
  imageProps?: ImageProps;
  selectItemInMarketId: (id: string) => void;
}
export const ItemCardMarket: FC<Props> = ({ itemInMarket, selectItemInMarketId }) => {
  const { item } = itemInMarket;
  const navigate = useNavigate();
  const location = useLocation();
  const buyAsset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate(`${routes.buyItem}/${itemInMarket.id}`, { state: location });
  };

  const { royalty, platformFee, price } = itemInMarket.sell;

  const totalPrice = Number(royalty + platformFee + price);

  return (
    <AssetWrapper onClick={() => selectItemInMarketId(itemInMarket.id)}>
      <AssetContent>
        <AssetImageContainer>
          <AssetImage src={itemInMarket.item.image} category={itemInMarket.item.category} />
        </AssetImageContainer>
        <AssetInfoContainer>
          <AssetTitleWrapper>
            <AssetTitleText>{item.name}</AssetTitleText>
            <BoldLabel>{item.category}</BoldLabel>
          </AssetTitleWrapper>
          <AssetStatsContainer>
            <AssetTag>
              <BoldLabel customColor={color.black}>lvl. </BoldLabel>
              <LevelBoldLabel customColor={color.black}>{item.level}</LevelBoldLabel>
            </AssetTag>
            <Badge>
              <ButtonText>{item.origin}</ButtonText>
            </Badge>
            <Badge>
              <ButtonText>{getRarityString(item.rarity)}</ButtonText>
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
    </AssetWrapper>
  );
};
