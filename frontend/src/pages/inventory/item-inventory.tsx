import React, { FC, useState } from "react";

import { LoadingPage, OverviewEmpty } from "../../components";
import { routes } from "../../navigation";
import { useGetItemInInventoryById, useGetItemsInInventory } from "../../service";
import { text } from "../../assets";
import { OverviewContainer } from "../shop/styles";
import { AssetCards } from "../../components/asset-cards/asset-cards";
import { AssetFilters } from "../../components/asset-filters/asset-filters";
import { AssetDetails } from "../../components/asset-details/asset-details";
import { SECTION } from "../../constants";

interface Props {
  pageSelector: React.ReactNode;
}

export const ItemsInventory: FC<Props> = ({ pageSelector }) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const [items, isLoading] = useGetItemsInInventory({
    categories: selectedCategories,
    sort: selectedSorting,
    color: selectedColor,
  });
  const [item] = useGetItemInInventoryById(selectedId);

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <AssetFilters
        pageSelector={pageSelector}
        section={SECTION.INVENTORY}
        assets={items}
        selectedCategories={selectedCategories}
        selectedSorting={selectedSorting}
        setSelectedSorting={setSelectedSorting}
        setSelectedCategories={setSelectedCategories}
        setSelectedColor={setSelectedColor}
      />
      <AssetCards section={SECTION.INVENTORY} assetsData={items} isLoading={isLoading} setAssetId={setSelectedId} />
      <AssetDetails section={SECTION.INVENTORY} assetData={item} assetId={selectedId} setAssetId={setSelectedId} />
      (!items?.length && (
      <OverviewContainer>
        <OverviewEmpty
          headingText={text.item.noItemsInInventory}
          descriptionText={text.item.buyItemsFromStore}
          buttonText={text.navigation.shop}
          redirectRoute={routes.shop}
          secondary
        />
      </OverviewContainer>
      ))
    </>
  );
};
