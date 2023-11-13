import React, { FC, useState } from "react";
import { ASSETS_PER_PAGE } from "../../constants";
import { AssetCardLoadMore } from "../asset-card-load-more/asset-card-load-more";
import { AssetsContainer, AssetsShopWrapper } from "./styles";
import { useViewport } from "../../hooks";
import { LoadingPage } from "../content-loader";
import { ItemCardMarket } from "../asset-card/item-card-market";
import { ItemInMarket } from "../../interfaces";

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
  itemsInMarket: ItemInMarket[];
  isLoading: boolean;
  selectItemInMarketId: (id: string) => void;
}

export const ItemCardsMarket: FC<Props> = ({ isLoading, itemsInMarket, selectItemInMarketId }) => {
  const { height } = useViewport();
  const [visibleAssets, setVisibleAssets] = useState<number>(ASSETS_PER_PAGE);
  const loadMoreAssets = () => {
    setVisibleAssets((prevVisibleAssets) => prevVisibleAssets + ASSETS_PER_PAGE);
  };

  if (isLoading) return <LoadingPage spinner={false} />;
  return (
    <AssetsShopWrapper height={height}>
      {itemsInMarket.length > 0 && (
        <AssetsContainer>
          {itemsInMarket.slice(0, visibleAssets).map((itemInMarket) => (
            <ItemCardMarket key={itemInMarket.id} itemInMarket={itemInMarket} selectItemInMarketId={selectItemInMarketId} />
          ))}
          {visibleAssets < itemsInMarket.length && <AssetCardLoadMore isLoading={isLoading} loadMore={loadMoreAssets} />}
        </AssetsContainer>
      )}
    </AssetsShopWrapper>
  );
};
