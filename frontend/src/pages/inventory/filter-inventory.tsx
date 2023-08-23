import React, { FC } from "react";

import { itemCategories, sortingInventory } from "../../assets/text/filter-options";
import { breakpoints, color } from "../../design";
import { ColorSelector, Filters, Label, Select } from "../../components";
import { SortByContainer } from "../shop/styles";
import { text } from "../../assets";
import { useIsMobile } from "../../hooks";

interface Props {
  selectedCategories: string[];
  selectedSorting: string;
  handleCategoryChange: (value: string | string[]) => void;
  handleSortingChange: (value: string | string[]) => void;
  setSelectedColor: (value: string) => void;
  colors: string[];
  filterId: string;
  openFilter: (id: string) => void;
  openFilters: () => void;
  numberOfFiltersSelected: number;
}
export const FilterInventory: FC<Props> = ({
  selectedCategories,
  selectedSorting,
  handleCategoryChange,
  handleSortingChange,
  setSelectedColor,
  colors,
  filterId,
  openFilter,
  openFilters,
  numberOfFiltersSelected,
}) => {
  const isMobile = useIsMobile(breakpoints.desktop);

  if (isMobile) {
    return <Filters label={`${text.filters.filters}: ${numberOfFiltersSelected}`} openFilter={openFilters} id={filterId} />;
  } else {
    return (
      <>
        <Filters
          label={selectedCategories.length === 0 ? text.filters.category : `${text.filters.category}: ${selectedCategories.length}`}
          openFilter={openFilter}
          id={filterId}
          hasValue={selectedCategories.length > 0}
        >
          <Select label={text.filters.allCategories} handleChange={handleCategoryChange} options={itemCategories} isMultiSelect />
        </Filters>
        <Filters label={text.filters.color} openFilter={openFilter} id={filterId}>
          <ColorSelector handleChange={setSelectedColor} colors={colors} />
        </Filters>
        <SortByContainer>
          <Label customColor={color.black}>{text.filters.sortBy}</Label>
          <Filters label={selectedSorting || text.filters.latest} openFilter={openFilter} id={filterId} hasValue={!!selectedSorting}>
            <Select label={text.filters.latest} handleChange={handleSortingChange} options={sortingInventory} />
          </Filters>
        </SortByContainer>
      </>
    );
  }
};
