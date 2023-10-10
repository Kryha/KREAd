import React, { FC, useState } from "react";
import { METRICS_ITEM, SECTION } from "../../constants";
import { useGetItemInShopById, useGetItemMarketMetrics, useGetItemsInShop } from "../../service";
import { routes } from "../../navigation";
import { AssetItemFilters } from "../../components/asset-item-filters/asset-item-filters";
import { ItemDetailsMarket } from "../../components/asset-details/item-details-market";
import { OverviewContainer } from "./styles";
import { HorizontalDivider, OverviewEmpty } from "../../components";
import { text } from "../../assets";
import { ItemCardsMarket } from "../../components/asset-cards/item-cards-market";
import { AssetFilterCount, AssetHeader, AssetHeaderContainer } from "../../components/asset-item-filters/styles";
import { color } from "../../design";
import { MarketplaceMetrics } from "../../components/marketplace-metrics/marketplace-metrics";
import { findAverageValue, findMinimumValue, toTwoDecimals, uISTToIST } from "../../util";

export const ItemsShop: FC = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [items, fetched] = useGetItemsInShop();
  const metrics = useGetItemMarketMetrics();
  const [item] = useGetItemInShopById(selectedId);
  const assetsCount = items.length;

  let metricsData: any = [];

  if (metrics) {
    let itemAverage = 0;
    let itemMinimum = 0;

    if (items.length != 0) {
      itemMinimum = findMinimumValue(items.map((x) => uISTToIST(Number(x.sell.price))));
      itemAverage = findAverageValue(items.map((x) => uISTToIST(Number(x.sell.price))));
    }

    metricsData = [
      metrics.amountSold,
      metrics.collectionSize,
      toTwoDecimals(itemMinimum),
      toTwoDecimals(itemAverage),
      toTwoDecimals(metrics.averageLevel),
      toTwoDecimals(metrics.marketplaceAverageLevel),
    ];
  }

  if (!items) return <></>;
  return (
    <>
      <AssetHeaderContainer>
        <AssetHeader>{metrics ? <MarketplaceMetrics data={metricsData} asset={METRICS_ITEM} /> : <></>}</AssetHeader>
        <AssetItemFilters section={SECTION.SHOP} />
      </AssetHeaderContainer>
      <AssetFilterCount customColor={color.darkGrey}>Market: {text.param.amountOfItems(assetsCount)}</AssetFilterCount>
      <HorizontalDivider />
      {selectedId && item && <ItemDetailsMarket itemInMarket={item} selectItemInMarket={(id: string) => setSelectedId(id)} />}
      {items.length > 0 ? (
        <ItemCardsMarket itemsInMarket={items} isLoading={fetched} selectItemInMarketId={(id: string) => setSelectedId(id)} />
      ) : (
        <OverviewContainer>
          <OverviewEmpty
            headingText={text.store.thereAreNoItemsInTheShop}
            descriptionText={text.store.thereAreNoItemsAvailable}
            buttonText={text.navigation.goHome}
            redirectRoute={routes.character}
            secondary
          />
        </OverviewContainer>
      )}
    </>
  );
};
