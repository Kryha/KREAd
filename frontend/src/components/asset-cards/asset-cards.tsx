import { FC, useState } from "react";
import { ASSETS_PER_PAGE, ASSET_TYPE, SECTION } from "../../constants";
import { AssetCardLoadMore } from "../asset-card-load-more/asset-card-load-more";
import { AssetsContainer, AssetsWrapper } from "./styles";
import { useViewport } from "../../hooks";
import { LoadingPage } from "../content-loader";
import { AssetCard } from "../asset-card";
import { assetTransformer } from "./asset-transformer";

interface Props {
  assetType: (typeof ASSET_TYPE)[keyof typeof ASSET_TYPE];
  section: (typeof SECTION)[keyof typeof SECTION];
  assetsData: any[];
  isLoading: boolean;
  setAssetId: (assetId: string) => void;
}

export const AssetCards: FC<Props> = ({ assetType, section, assetsData, isLoading, setAssetId }) => {
  const { height } = useViewport();
  const [visibleAssets, setVisibleAssets] = useState(ASSETS_PER_PAGE);
  const loadMoreAssets = () => {
    setVisibleAssets((prevVisibleAssets) => prevVisibleAssets + ASSETS_PER_PAGE);
  };
  console.log({ assetsData });

  // Transform and structure data based on section
  const transformedData = assetsData
    .map((asset) => {
      const transform = assetTransformer[assetType]?.[section];
      // return transform && transform(asset.nft || asset.character || asset.item);
      return transform && transform(asset);
    })
    .filter((asset) => asset !== undefined);

  console.log({ transformedData });
  if (isLoading) return <LoadingPage spinner={false} />;
  return (
    <AssetsWrapper height={height}>
      {transformedData.length > 0 && (
        <AssetsContainer>
          {transformedData.slice(0, visibleAssets).map((asset) => (
            <AssetCard assetType={assetType} section={section} key={asset.id} data={asset} onClick={() => setAssetId(asset.id)} />
          ))}
          {visibleAssets < transformedData.length && <AssetCardLoadMore isLoading={isLoading} loadMore={loadMoreAssets} />}
        </AssetsContainer>
      )}
    </AssetsWrapper>
  );
};
