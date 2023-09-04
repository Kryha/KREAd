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
import { ASSET_TYPE, SECTION } from "../../constants";
import { AssetData } from "../asset-cards/asset-transformer";
import { BaseCharacter } from "../base-character";

interface Props {
  assetType: (typeof ASSET_TYPE)[keyof typeof ASSET_TYPE];
  section: (typeof SECTION)[keyof typeof SECTION];
  data: AssetData;
  onClick?: (assetId: string) => void;
  imageProps?: ImageProps;
}
export const AssetCard: FC<Props> = ({ assetType, section, data, onClick }) => {
  const handleClick = () => {
    onClick && onClick(data.id);
  };

  if (!isItemCategory(data.category) && !isCharacterCategory(data.category)) return <></>;

  return (
    <AssetWrapper onClick={() => handleClick()}>
      <AssetContent>
        {data.image && assetType === ASSET_TYPE.CHARACTER && (
          <BaseCharacter characterImage={data.image} items={data.equippedItems} isZoomed={false} size="medium" />
        )}
        <AssetImageContainer>
          {data.image && assetType === ASSET_TYPE.ITEM && <AssetImage src={data.image} category={data.category} />}
          {!data.image && <NoAssetImage />}
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
                  {data.rarity && (
                    <>
                      <Dash />
                      <BoldLabel customColor={color.black}>{text.param.rarity(data.rarity)}</BoldLabel>
                    </>
                  )}
                </AssetTag>
                {data.isEquipped && <BoldLabel customColor={color.black}>{text.general.equipped}</BoldLabel>}
                {data.isForSale && <BoldLabel customColor={color.black}>{text.general.forSale}</BoldLabel>}
              </>
            )}
            {section === SECTION.SHOP && (
              <>
                <AssetTag>
                  <BoldLabel customColor={color.black}>{text.param.level(data.level)}</BoldLabel>
                  {data.rarity && (
                    <>
                      <Dash />
                      <BoldLabel customColor={color.black}>{text.param.rarity(data.rarity)}</BoldLabel>
                    </>
                  )}
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
