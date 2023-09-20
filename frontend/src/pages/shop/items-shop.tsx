import React, { FC, ReactNode, useState } from "react";
import { ASSET_TYPE, MAX_PRICE, MIN_PRICE, SECTION } from "../../constants";
import { useGetItemInShopById } from "../../service";
import { routes } from "../../navigation";
import { AssetItemFilters } from "../../components/asset-item-filters/asset-item-filters";
import { ItemDetailsMarket } from "../../components/asset-details/item-details-market";
import { OverviewContainer } from "./styles";
import { OverviewEmpty } from "../../components";
import { text } from "../../assets";
import { ItemCardsMarket } from "../../components/asset-cards/item-cards-market";
import { ItemCategory } from "../../interfaces";
import { useItemMarketState } from "../../context/item-shop-context";

interface Props {
  pageSelector?: ReactNode;
}

export const ItemsShop: FC<Props> = ({ pageSelector }) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>([]);
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{
    min: number;
    max: number;
  }>({ min: MIN_PRICE, max: MAX_PRICE });

  const { items, fetched } = useItemMarketState();
  const isLoading = !fetched;

  // FIXME: Leaving commented code for implementation of filter logic
  // const [items, isLoading] = useGetItemsInShop({
  //   categories: selectedCategories,
  //   sort: selectedSorting,
  //   price: selectedPrice,
  //   color: selectedColor,
  // });
  const [item] = useGetItemInShopById(selectedId);

  if (!items) return <></>;
  return (
    <>
      <AssetItemFilters
        assetType={ASSET_TYPE.ITEM}
        section={SECTION.SHOP}
        pageSelector={pageSelector}
        assets={items}
        selectedCategories={selectedCategories}
        selectedSorting={selectedSorting}
        selectedPrice={selectedPrice}
        setSelectedSorting={setSelectedSorting}
        setSelectedCategories={setSelectedCategories}
        setSelectedColor={setSelectedColor}
        setSelectedPrice={setSelectedPrice}
      />
      {selectedId && <ItemDetailsMarket itemInMarket={item!} selectItemInMarket={(id: string) => setSelectedId(id)} />}
      {items.length > 0 ? (
        <ItemCardsMarket itemsInMarket={items} isLoading={isLoading} selectItemInMarketId={(id: string) => setSelectedId(id)} />
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
