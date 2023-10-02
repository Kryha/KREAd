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

  // TODO: replace identifier with logo
  const metricsData = metrics
    ? [
      metrics.amountSold,
      metrics.collectionSize,
      toTwoDecimals(findMinimumValue(items.map((x) => uISTToIST(Number(x.sell.price))))),
      toTwoDecimals(findAverageValue(items.map((x) => uISTToIST(Number(x.sell.price))))),
      toTwoDecimals(metrics.averageLevel),
      toTwoDecimals(metrics.marketplaceAverageLevel),
    ]
    : [];

  if (!items) return <></>;

  //FIXME: disable hair and perk for now until fixed
  const filteredItems = items.filter((entry) => entry.item.category != "hair" && entry.item.category != "perk2");

  return (
    <>
      <AssetHeaderContainer>
        <AssetHeader>{metrics ? <MarketplaceMetrics data={metricsData} asset={METRICS_ITEM} /> : <></>}</AssetHeader>
        <AssetItemFilters section={SECTION.SHOP} />
      </AssetHeaderContainer>
      <AssetFilterCount customColor={color.darkGrey}>Market: {text.param.amountOfItems(assetsCount)}</AssetFilterCount>
      <HorizontalDivider />
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
