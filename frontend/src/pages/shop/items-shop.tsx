import React, { FC, ReactNode, useState } from "react";
import { ASSET_TYPE, MAX_PRICE, MIN_PRICE, SECTION } from "../../constants";
import { useGetItemInShopById, useGetItemsInShop } from "../../service";
import { routes } from "../../navigation";
import { AssetFilters } from "../../components/asset-filters/asset-filters";
import { AssetDetails } from "../../components/asset-details/asset-details";
import { AssetCards } from "../../components/asset-cards/asset-cards";
import { OverviewContainer } from "./styles";
import { OverviewEmpty } from "../../components";
import { text } from "../../assets";

interface Props {
  pageSelector: ReactNode;
}

export const ItemsShop: FC<Props> = ({ pageSelector }) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number }>({ min: MIN_PRICE, max: MAX_PRICE });

  const [items, isLoading] = useGetItemsInShop({
    categories: selectedCategories,
    sort: selectedSorting,
    price: selectedPrice,
    color: selectedColor,
  });

  const [item] = useGetItemInShopById(selectedId);

  return (
    <>
      <AssetFilters
        pageSelector={pageSelector}
        section={SECTION.SHOP}
        assets={items}
        selectedCategories={selectedCategories}
        selectedSorting={selectedSorting}
        selectedPrice={selectedPrice}
        setSelectedSorting={setSelectedSorting}
        setSelectedCategories={setSelectedCategories}
        setSelectedColor={setSelectedColor}
        setSelectedPrice={setSelectedPrice}
      />
      <AssetDetails assetType={ASSET_TYPE.ITEM} section={SECTION.SHOP} assetData={item} assetId={selectedId} setAssetId={setSelectedId} />
      {items.length > 0 ? (
        <AssetCards
          assetType={ASSET_TYPE.ITEM}
          section={SECTION.SHOP}
          assetsData={items}
          isLoading={isLoading}
          setAssetId={setSelectedId}
        />
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
