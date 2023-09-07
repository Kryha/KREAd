import React, { FC, useState } from "react";

import {
  characterInventoryCategories,
  characterShopCategories,
  itemInventoryCategories,
  itemShopCategories,
  sortCharactersInInventory,
  sortCharactersInShop,
  sortItemsInInventory,
  sortItemsInShop,
} from "../../assets/text/filter-options";
import { breakpoints, color } from "../../design";
import { ColorSelector, Filters, HorizontalDivider, Label, PriceSelector, Select } from "../../components";
import { text } from "../../assets";
import { useIsMobile } from "../../hooks";
import { AssetFilterContainer, AssetFilterCount, AssetFilterWrapper, AssetSelectorContainer, SortAssetsByContainer } from "./styles";
import { ASSET_TYPE, MAX_PRICE, MIN_PRICE, SECTION } from "../../constants";

interface Props {
  assetType: (typeof ASSET_TYPE)[keyof typeof ASSET_TYPE];
  section: (typeof SECTION)[keyof typeof SECTION];
  assets: any[];
  selectedCategories: string[];
  selectedSorting: string;
  selectedPrice?: { min: number; max: number };
  setSelectedCategories: (value: ItemCategory[]) => void;
  setSelectedSorting: (value: string) => void;
  setSelectedColor?: (value: string) => void;
  setSelectedPrice?: (value: { min: number; max: number }) => void;
  pageSelector: React.ReactNode;
}

export const AssetFilters: FC<Props> = ({
  assetType,
  section,
  assets,
  selectedCategories,
  selectedSorting,
  selectedPrice,
  setSelectedCategories,
  setSelectedSorting,
  setSelectedColor,
  setSelectedPrice,
  pageSelector,
}) => {
  const isMobile = useIsMobile(breakpoints.desktop);
  const numberOfFiltersSelected = selectedCategories.length;
  const assetsCount = assets.length;

  const [showFilter, setShowFilter] = useState(false);
  const [filterId, setFilterId] = useState("");

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };

  const openFilters = () => {
    setShowFilter(!showFilter);
  };

  const categories =
    assetType === ASSET_TYPE.ITEM
      ? // Items
        section === SECTION.INVENTORY
        ? itemInventoryCategories
        : itemShopCategories
      : // Characters
      section === SECTION.INVENTORY
      ? characterInventoryCategories
      : characterShopCategories;

  const sortOptions =
    assetType === ASSET_TYPE.ITEM
      ? // Items
        section === SECTION.INVENTORY
        ? sortItemsInInventory
        : sortItemsInShop
      : // Characters
      section === SECTION.INVENTORY
      ? sortCharactersInInventory
      : sortCharactersInShop;

  const handleCategoryChange = (selected: string | string[]) => {
    if (Array.isArray(selected)) {
      setSelectedCategories(selected); // Handle multi-select
    } else {
      setSelectedCategories([selected]); // Handle single-select
    }
  };

  const handleSortingChange = (selected: string | string[]) => {
    setSelectedSorting(selected as string);
  };

  const handlePriceChange = (min: number, max: number) => {
    if (setSelectedPrice) {
      setSelectedPrice({ min: min, max: max });
    }
  };

  return (
    <>
      <AssetFilterWrapper>
        <AssetFilterContainer>
          <AssetSelectorContainer>
            {pageSelector}
            {isMobile && <Filters label={`${text.filters.filters}: ${numberOfFiltersSelected}`} openFilter={openFilters} id={filterId} />}
            {!isMobile && (
              <>
                <Filters
                  label={selectedCategories.length === 0 ? text.filters.category : `${text.filters.category}: ${selectedCategories.length}`}
                  openFilter={openFilter}
                  id={filterId}
                  hasValue={selectedCategories.length > 0}
                >
                  <Select label={text.filters.allCategories} handleChange={handleCategoryChange} options={categories} isMultiSelect />
                </Filters>
                {section === SECTION.SHOP && (
                  <Filters label={text.filters.price} openFilter={openFilter} id={filterId}>
                    {selectedPrice && <PriceSelector handleChange={handlePriceChange} min={MIN_PRICE} max={MAX_PRICE} />}
                  </Filters>
                )}
                {setSelectedColor && (
                  <Filters label={text.filters.color} openFilter={openFilter} id={filterId}>
                    <ColorSelector handleChange={setSelectedColor} />
                  </Filters>
                )}
                <SortAssetsByContainer>
                  <Label customColor={color.black}>{text.filters.sortBy}</Label>
                  <Filters
                    label={selectedSorting || text.filters.latest}
                    openFilter={openFilter}
                    id={filterId}
                    hasValue={!!selectedSorting}
                  >
                    <Select label={text.filters.latest} handleChange={handleSortingChange} options={sortOptions} />
                  </Filters>
                </SortAssetsByContainer>
              </>
            )}
          </AssetSelectorContainer>
        </AssetFilterContainer>
        <AssetFilterCount customColor={color.darkGrey}>{text.param.amountOfAssets(assetsCount)}</AssetFilterCount>
        <HorizontalDivider />
      </AssetFilterWrapper>
    </>
  );
};
