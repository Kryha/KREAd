import React, { FC, useState } from "react";

import { LoadingPage, OverviewEmpty } from "../../components";
import { routes } from "../../navigation";
import { useGetItemInInventoryByNameAndCategory, useGetItemsInInventory } from "../../service";
import { text } from "../../assets";
import { OverviewContainer } from "../shop/styles";
import { AssetCards } from "../../components/asset-cards/asset-cards";
import { AssetFilters } from "../../components/asset-filters/asset-filters";
import { SECTION } from "../../constants";
import { ItemCategory } from "../../interfaces";
import { AssetDetailsInventory } from "../../components/asset-details/asset-details-inventory";

interface Props {
  pageSelector: React.ReactNode;
}

export const ItemsInventory: FC<Props> = ({ pageSelector }) => {
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>([]);
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const selectItem = (name: string, category: ItemCategory | undefined) => {
    setSelectedName(name);
    setSelectedCategory(category);
  }
  const [items, isLoading] = useGetItemsInInventory({
    categories: selectedCategories,
    sort: selectedSorting,
    color: selectedColor,
  });
  const [item] = useGetItemInInventoryByNameAndCategory(selectedName, selectedCategory);

  if (isLoading) return <LoadingPage />;

  console.log("🤩", items, item)
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
      <AssetCards section={SECTION.INVENTORY} assetsData={items} isLoading={isLoading} selectItem={selectItem} />
      {item && <AssetDetailsInventory section={SECTION.INVENTORY} item={item} selectedItem={{ name: selectedName, category: selectedCategory }} selectItem={selectItem} />}
      {!items?.length && (
        <OverviewContainer>
          <OverviewEmpty
            headingText={text.item.noItemsInInventory}
            descriptionText={text.item.buyItemsFromStore}
            buttonText={text.navigation.shop}
            redirectRoute={routes.shop}
            secondary
          />
        </OverviewContainer>
      )}
    </>
  );
};
