import { FC, useState } from "react";
import { ASSETS_PER_PAGE, ASSET_TYPE, SECTION } from "../../constants";
import { AssetCardLoadMore } from "../asset-card-load-more/asset-card-load-more";
import { AssetsContainer, AssetsWrapper } from "./styles";
import { useViewport } from "../../hooks";
import { LoadingPage } from "../content-loader";
import { AssetCard } from "../asset-card";

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
  assetType: (typeof ASSET_TYPE)[keyof typeof ASSET_TYPE];
  section: (typeof SECTION)[keyof typeof SECTION];
  assetsData: any[];
  isLoading: boolean;
  setAssetId: (assetId: string) => void;
}

export const AssetCards: FC<Props> = ({ assetType, assetsData, isLoading, setAssetId, section }) => {
  const { height } = useViewport();
  const [visibleAssets, setVisibleAssets] = useState(ASSETS_PER_PAGE);
  const loadMoreAssets = () => {
    setVisibleAssets((prevVisibleAssets) => prevVisibleAssets + ASSETS_PER_PAGE);
  };

  // Transform and structure data based on section
  const transformedData: any[] = assetsData
    .map((asset) => {
      switch (assetType) {
        case ASSET_TYPE.CHARACTER:
          switch (section) {
            case SECTION.INVENTORY:
              return {
                id: asset.id,
                image: asset.image,
                name: asset.name,
                category: asset.type,
                level: asset.level,
                isEquipped: asset.isEquipped,
                isForSale: asset.isForSale,
              };
            case SECTION.SHOP:
              return {
                id: asset.id,
                image: asset.character.image,
                name: asset.character.name,
                category: asset.character.type,
                level: asset.character.level,
                price: asset.sell.price,
              };
            default:
              return undefined;
          }
        case ASSET_TYPE.ITEM:
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
      }
    })
    .filter((asset) => asset !== undefined);

  if (isLoading) return <LoadingPage spinner={false} />;
  return (
    <AssetsWrapper height={height}>
      {transformedData.length > 0 && (
        <AssetsContainer>
          {transformedData.slice(0, visibleAssets).map((asset) => (
            <AssetCard key={asset.id} data={asset} onClick={() => setAssetId(asset.id)} section={section} />
          ))}
          {visibleAssets < transformedData.length && <AssetCardLoadMore isLoading={isLoading} loadMore={loadMoreAssets} />}
        </AssetsContainer>
      )}
    </AssetsWrapper>
  );
};
