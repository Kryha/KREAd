import React, { FC, ReactNode, useState } from "react";
import { ASSET_TYPE, MAX_PRICE, MIN_PRICE, SECTION } from "../../constants";
import { useGetItemInShopById, useGetItemsInShop } from "../../service";
import { routes } from "../../navigation";
import { AssetFilters } from "../../components/asset-filters/asset-filters";
import { ItemDetailsMarket } from "../../components/asset-details/item-details-market";
import { OverviewContainer } from "./styles";
import { OverviewEmpty } from "../../components";
import { text } from "../../assets";
import { ItemCardsMarket } from "../../components/asset-cards/item-cards-market";
import { useItemMarketState } from "../../context/item-shop";

interface Props {
  pageSelector: ReactNode;
}

export const ItemsShop: FC<Props> = ({ pageSelector }) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number }>({ min: MIN_PRICE, max: MAX_PRICE });

  const { items, fetched } = useItemMarketState();
  const isLoading = !fetched;

  // const [items, isLoading] = useGetItemsInShop({
  //   categories: selectedCategories,
  //   sort: selectedSorting,
  //   price: selectedPrice,
  //   color: selectedColor,
  // });
  console.log(items);
  const [item] = useGetItemInShopById(selectedId);
  console.log("ID: ", selectedId);

  if (!items) return <></>;
  return (
    <>
      <AssetFilters
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
