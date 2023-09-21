import React, { FC, useState } from "react";
import { HorizontalDivider, LoadingPage, OverviewEmpty } from "../../components";
import { routes } from "../../navigation";
import { useGetItemInInventoryByNameAndCategory, useGetItemsInInventory } from "../../service";
import { text } from "../../assets";
import { OverviewContainer } from "../shop/styles";
import { AssetItemFilters } from "../../components/asset-item-filters/asset-item-filters";
import { Category } from "../../interfaces";
import { ItemDetailsInventory } from "../../components/asset-details/item-details-inventory";
import { ASSET_TYPE, SECTION } from "../../constants";
import { ItemCardsInventory } from "../../components/asset-cards/item-cards-inventory";
import { AssetFilterCount } from "../../components/asset-item-filters/styles";
import { color } from "../../design";

interface Props {
  pageSelector?: React.ReactNode;
}

export const ItemsInventory: FC<Props> = ({ pageSelector }) => {
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const selectItem = (name: string, category: Category | undefined) => {
    setSelectedName(name);
    setSelectedCategory(category);
  };
  const [items, isLoading] = useGetItemsInInventory({
    categories: selectedCategories,
    sort: selectedSorting,
    color: selectedColor,
  });

  const [item] = useGetItemInInventoryByNameAndCategory(selectedName, selectedCategory);
  const assetsCount = items.length;

  if (isLoading) return <LoadingPage />;

  return (
    <>
      <AssetItemFilters
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
      <AssetFilterCount customColor={color.darkGrey}>Inventory: {text.param.amountOfItems(assetsCount)}</AssetFilterCount>
      <HorizontalDivider />
      {item && (
        <ItemDetailsInventory item={item} selectedItem={{ name: selectedName, category: selectedCategory }} selectItem={selectItem} />
      )}
      {items.length > 0 ? (
        <ItemCardsInventory items={items} isLoading={isLoading} selectItem={selectItem} />
      ) : (
        <OverviewContainer>
          <OverviewEmpty
            headingText={text.inventory.noItemsTitle}
            descriptionText={text.item.buyItemsFromStore}
            buttonText={text.item.buyItemsFromStore}
            redirectRoute={routes.shop}
            secondary
          />
        </OverviewContainer>
      )}
    </>
  );
};
