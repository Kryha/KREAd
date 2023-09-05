import React, { FC, useState } from "react";
import { ASSETS_PER_PAGE, SECTION } from "../../constants";
import { AssetCardLoadMore } from "../asset-card-load-more/asset-card-load-more";
import { AssetsContainer, AssetsWrapper } from "./styles";
import { useViewport } from "../../hooks";
import { LoadingPage } from "../content-loader";
import { AssetCard } from "../asset-card";
import { ItemCategory } from "../../interfaces";

export interface AssetData {
  id: string;
  image: string;
  name: string;
  category: string;
  level: number;
  rarity: number;
  isEquipped?: boolean;
  isForSale?: boolean;
  price?: bigint;
}

interface Props {
  assetsData: any[];
  isLoading: boolean;
  selectItem: (name: string, category: ItemCategory) => void;
  section: (typeof SECTION)[keyof typeof SECTION];
}

export const AssetCards: FC<Props> = ({ assetsData, isLoading, selectItem, section }) => {
  const { height } = useViewport();
  const [visibleAssets, setVisibleAssets] = useState(ASSETS_PER_PAGE);
  const loadMoreAssets = () => {
    setVisibleAssets((prevVisibleAssets) => prevVisibleAssets + ASSETS_PER_PAGE);
  };

  // Transform and structure data based on section
  const transformedData: any[] = assetsData
    .map((asset) => {
      switch (section) {
        case SECTION.INVENTORY:
          return {
            id: asset.id,
            image: asset.thumbnail,
            name: asset.name,
            category: asset.category,
            level: asset.level,
            rarity: asset.rarity,
            isEquipped: asset.isEquipped,
            isForSale: asset.isForSale,
          };
        case SECTION.SHOP:
          return {
            id: asset.id,
            image: asset.item.thumbnail,
            name: asset.item.name,
            category: asset.item.category,
            level: asset.item.level,
            rarity: asset.item.rarity,
            price: asset.sell.price,
          };
        default:
          return undefined;
      }
    })
    .filter((asset) => asset !== undefined);

  if (isLoading) return <LoadingPage spinner={false} />;
  return (
    <AssetsWrapper height={height}>
      {transformedData.length > 0 && (
        <AssetsContainer>
          {transformedData.slice(0, visibleAssets).map((asset) => (
            <AssetCard
              key={asset.name + asset.category}
              data={asset}
              onClick={() => selectItem(asset.name, asset.category)}
              section={section}
            />
          ))}
          {visibleAssets < transformedData.length && <AssetCardLoadMore isLoading={isLoading} loadMore={loadMoreAssets} />}
        </AssetsContainer>
      )}
    </AssetsWrapper>
  );
};
