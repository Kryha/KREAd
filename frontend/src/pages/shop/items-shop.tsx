import React, { FC, ReactNode, useState } from "react";
import { SECTION } from "../../constants";
import { useGetItemInShopById, useGetItemsInShop } from "../../service";
import { routes } from "../../navigation";
import { AssetItemFilters } from "../../components/asset-item-filters/asset-item-filters";
import { ItemDetailsMarket } from "../../components/asset-details/item-details-market";
import { OverviewContainer } from "./styles";
import { HorizontalDivider, OverviewEmpty } from "../../components";
import { text } from "../../assets";
import { ItemCardsMarket } from "../../components/asset-cards/item-cards-market";
import { AssetFilterCount } from "../../components/asset-item-filters/styles";
import { color } from "../../design";
import { MarketplaceMetrics } from "../../components/marketplace-metrics/marketplace-metrics";

interface Props {
  pageSelector?: ReactNode;
}

export const ItemsShop: FC<Props> = ({ pageSelector }) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [items, fetched] = useGetItemsInShop();
  const [item] = useGetItemInShopById(selectedId);
  const assetsCount = items.length;

  const metricsLabels = ["Sales", "Collection size", "Floor price", "Avg. item price", "Avg. item rarity"];
  const metricsValues = ["1.048", "460", "IST 0.14", "IST 0.14", "7"];

  if (!items) return <></>;
  return (
    <>
      <AssetItemFilters section={SECTION.SHOP} pageSelector={pageSelector} />
      <AssetFilterCount customColor={color.darkGrey}>Inventory: {text.param.amountOfItems(assetsCount)}</AssetFilterCount>
      <MarketplaceMetrics header={metricsLabels} data={metricsValues} />
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
