import React, { FC, useState } from "react";
import { LoadingPage, OverviewEmpty } from "../../components";
import { routes } from "../../navigation";
import { useGetItemInInventoryByNameAndCategory, useGetItemsInInventory } from "../../service";
import { text } from "../../assets";
import { OverviewContainer } from "../shop/styles";
import { AssetFilters } from "../../components/asset-filters/asset-filters";
import { ItemCategory } from "../../interfaces";
import { ItemDetailsInventory } from "../../components/asset-details/item-details-inventory";
import { ASSET_TYPE, SECTION } from "../../constants";
import { ItemCardsInventory } from "../../components/asset-cards/item-cards-inventory";

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
  };
  const [items, isLoading] = useGetItemsInInventory({
    categories: selectedCategories,
    sort: selectedSorting,
    color: selectedColor,
  });

  const [item] = useGetItemInInventoryByNameAndCategory(selectedName, selectedCategory);

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <AssetFilters
        assetType={ASSET_TYPE.ITEM}
        section={SECTION.INVENTORY}
        pageSelector={pageSelector}
        assets={items}
        selectedCategories={selectedCategories}
        selectedSorting={selectedSorting}
        setSelectedSorting={setSelectedSorting}
        setSelectedCategories={setSelectedCategories}
        setSelectedColor={setSelectedColor}
      />
      <ItemCardsInventory
        items={items}
        isLoading={isLoading}
        selectItem={selectItem}
        selectedItem={{ name: selectedName, category: selectedCategory }}
      />
      {item && (
        <ItemDetailsInventory
          section={SECTION.INVENTORY}
          item={item}
          selectedItem={{ name: selectedName, category: selectedCategory }}
          selectItem={selectItem}
        />
      )}
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
