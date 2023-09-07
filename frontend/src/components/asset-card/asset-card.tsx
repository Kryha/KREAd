import { isCharacterCategory, isItemCategory } from "../../interfaces";
import { BoldLabel, Dash, ImageProps } from "../atoms";
import { FC } from "react";
import {
  AssetContent,
  AssetFooter,
  AssetImage,
  AssetImageContainer,
  AssetInfoContainer,
  AssetTag,
  AssetTagPrice,
  AssetTitleText,
  AssetTitleWrapper,
  AssetWrapper,
  NoAssetImage,
} from "./styles";
import { text } from "../../assets";
import { color } from "../../design";
import { PriceInIst } from "../price-in-ist";
import { AssetData } from "../asset-cards/asset-cards";
import { SECTION } from "../../constants";

interface Props {
  data: AssetData;
  onClick?: (assetId: string) => void;
  imageProps?: ImageProps;
  section: (typeof SECTION)[keyof typeof SECTION];
}
export const AssetCard: FC<Props> = ({ data, onClick, section }) => {
  const handleClick = () => {
    onClick && onClick(data.id);
  };

  if (!isItemCategory(data.category) && !isCharacterCategory(data.category)) return <></>;

  return (
    <AssetWrapper onClick={() => handleClick()}>
      <AssetContent>
        <AssetImageContainer>
          {data.image ? <AssetImage src={data.image} category={data.category} /> : <NoAssetImage />}
        </AssetImageContainer>
        <AssetInfoContainer>
          <AssetTitleWrapper>
            <AssetTitleText>{data.name}</AssetTitleText>
            <BoldLabel>{text.param.categories[data.category]}</BoldLabel>
          </AssetTitleWrapper>
          <AssetFooter>
            {section === SECTION.INVENTORY && (
              <>
                <AssetTag>
                  <BoldLabel customColor={color.black}>{text.param.level(data.level)}</BoldLabel>
                  <Dash />
                  <BoldLabel customColor={color.black}>{text.param.rarity(data.rarity)}</BoldLabel>
                </AssetTag>
                {data.isEquipped && <BoldLabel customColor={color.black}>{text.general.equipped}</BoldLabel>}
                {data.isForSale && <BoldLabel customColor={color.black}>{text.general.forSale}</BoldLabel>}
              </>
            )}
            {section === SECTION.SHOP && (
              <>
                <AssetTag>
                  <BoldLabel customColor={color.black}>{text.param.level(data.level)}</BoldLabel>
                  <Dash />
                  <BoldLabel customColor={color.black}>{text.param.rarity(data.rarity)}</BoldLabel>
                </AssetTag>
                <AssetTagPrice>{<PriceInIst price={Number(data.price)} />}</AssetTagPrice>
              </>
            )}
          </AssetFooter>
        </AssetInfoContainer>
      </AssetContent>
    </AssetWrapper>
  );
};
