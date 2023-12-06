import React, { FC, useMemo, useState } from "react";
import { EXCLUDE_ITEMS_SHOP, METRICS_ITEM, SECTION } from "../../constants";
import { getRarityString, useGetItemInShopById, useGetItemMarketMetrics, useGetItemsInShop } from "../../service";
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
import { ItemInMarket } from "../../interfaces";
import { useItemMarketState } from "../../context/item-shop-context";

export const ItemsShop: FC = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [items, fetched] = useGetItemsInShop();
  const { items: allMarketItems } = useItemMarketState();
  const metrics = useGetItemMarketMetrics();
  const [item] = useGetItemInShopById(selectedId);

  const filteredItems = useMemo(() => {
    let toRemove = [] as ItemInMarket[];
    let filtered = items;
    if (EXCLUDE_ITEMS_SHOP.length) {
      for (const filter of EXCLUDE_ITEMS_SHOP) {
        toRemove = [
          ...toRemove,
          ...items.filter(({ item }) => filter[0] === item.category && filter[1].includes(getRarityString(item.rarity))),
        ];
      }
      filtered = items.filter((entry) => !toRemove.includes(entry));
    }
    return filtered;
  }, [items]);

  const metricsData = useMemo(() => {
    if (metrics) {
      let itemAverage = 0;
      let itemMinimum = 0;

      if (filteredItems.length != 0) {
        itemMinimum = findMinimumValue(allMarketItems.map((x) => uISTToIST(Number(x.sell.price))));
        itemAverage = findAverageValue(allMarketItems.map((x) => uISTToIST(Number(x.sell.price))));
      }

      return [
        metrics.amountSold,
        metrics.collectionSize,
        toTwoDecimals(itemMinimum),
        toTwoDecimals(itemAverage),
        toTwoDecimals(metrics.averageLevel),
        toTwoDecimals(metrics.marketplaceAverageLevel),
      ];
    }
    return [];
  }, [metrics, filteredItems]);

  if (!filteredItems) return <></>;
  const assetsCount = filteredItems.length;

  return (
    <>
      <AssetHeaderContainer>
        <AssetHeader>{metrics ? <MarketplaceMetrics data={metricsData} asset={METRICS_ITEM} /> : <></>}</AssetHeader>
        <AssetItemFilters section={SECTION.SHOP} />
        <AssetFilterCount customColor={color.darkGrey}>Market: {text.param.amountOfItems(assetsCount)}</AssetFilterCount>
        <HorizontalDivider />
      </AssetHeaderContainer>
      {selectedId && item && <ItemDetailsMarket itemInMarket={item} selectItemInMarket={(id: string) => setSelectedId(id)} />}
      {filteredItems.length > 0 ? (
        <ItemCardsMarket itemsInMarket={filteredItems} isLoading={fetched} selectItemInMarketId={(id: string) => setSelectedId(id)} />
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
