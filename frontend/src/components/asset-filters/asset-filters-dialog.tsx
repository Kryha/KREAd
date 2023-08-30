import { useViewport } from "../../hooks";
import { ButtonContainer } from "../input-fields/styles";
import { ButtonText, FadeInOut, Overlay, PrimaryButton, SecondaryButton } from "../index";
import { text } from "../../assets";
import { color } from "../../design";
import { FC, useState } from "react";
import { ArrowContainer, Close, Divider, DividerContainer, ReturnContainer } from "../notification-detail/styles";
import { ItemEquip } from "../../interfaces";
import { itemInventoryCategories, itemShopCategories, sortItemsInInventory, sortItemsInShop } from "../../assets/text/filter-options";
import { filterItems } from "../../util";
import {
  AssetFilterContainer,
  AssetFilterDialogBox,
  AssetFilterDialogSection,
  AssetFilterDialogTitle,
  AssetFilterDialogWrapper,
  AssetFilterToggleButton,
  AssetHeader,
} from "./styles";
import { SECTION } from "../../constants";

interface Props {
  items: ItemEquip[];
  handleCategoryChange: (selected: string[]) => void;
  handleSortingChange: (selected: string) => void;
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  section: (typeof SECTION)[keyof typeof SECTION];
}

// TODO: Prototype for mobile filtering
export const AssetFiltersDialog: FC<Props> = ({ items, showFilter, setShowFilter, handleCategoryChange, handleSortingChange, section }) => {
  const { height, width } = useViewport();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // State for selected categories
  const [selectedSorting] = useState<string>(""); // State for selected sorting

  // Apply filters and get filtered items
  const filteredItems = filterItems(items, {
    categories: selectedCategories,
    sort: selectedSorting,
    color: "",
  });

  const filteredItemCount = filteredItems.length;

  const toggleCategory = (category: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category) ? prevSelected.filter((item) => item !== category) : [...prevSelected, category]
    );
  };

  const sortAssets = section === SECTION.INVENTORY ? sortItemsInInventory : sortItemsInShop;
  const categories = section === SECTION.INVENTORY ? itemInventoryCategories : itemShopCategories;
  return (
    <FadeInOut show={showFilter} exiting={!showFilter}>
      {showFilter && <Overlay isOnTop={true} />}
      <AssetFilterDialogBox height={height} width={width}>
        <AssetHeader>
          <DividerContainer>
            <ReturnContainer>
              <Divider />
              <ArrowContainer>
                <Close onClick={() => setShowFilter(false)} />
              </ArrowContainer>
            </ReturnContainer>
          </DividerContainer>
        </AssetHeader>
        <AssetFilterDialogWrapper>
          <AssetFilterContainer>
            <AssetFilterDialogTitle>{text.filters.categories}</AssetFilterDialogTitle>
            <AssetFilterDialogSection>
              {categories.map((category) => (
                <AssetFilterToggleButton
                  key={category.value}
                  selected={selectedCategories.includes(category.value)}
                  onClick={() => toggleCategory(category.value)}
                >
                  {category.label}
                </AssetFilterToggleButton>
              ))}
            </AssetFilterDialogSection>
            <AssetFilterDialogTitle>{text.filters.sortBy}</AssetFilterDialogTitle>
            <AssetFilterDialogSection>
              {sortAssets.map((sortBy) => (
                <AssetFilterToggleButton
                  key={sortBy.value}
                  selected={selectedSorting.includes(sortBy.value)}
                  onClick={() => {
                    handleSortingChange(sortBy.value);
                  }}
                >
                  {sortBy.label}
                </AssetFilterToggleButton>
              ))}
            </AssetFilterDialogSection>
          </AssetFilterContainer>
        </AssetFilterDialogWrapper>
        <ButtonContainer>
          <SecondaryButton
            onClick={() => {
              handleCategoryChange([]); // Clear all selected categories
              handleSortingChange(""); // Clear all selected sorting
            }}
          >
            <ButtonText>{text.filters.clearFilter}</ButtonText>
          </SecondaryButton>
          <PrimaryButton
            onClick={() => {
              setShowFilter(false); // Close the filter modal
              handleCategoryChange(selectedCategories); // Apply selected categories
              handleSortingChange(selectedSorting); // Apply selected sorting
            }}
          >
            <ButtonText customColor={color.white}>{`Show ${filteredItemCount} assets`}</ButtonText>
          </PrimaryButton>
        </ButtonContainer>
      </AssetFilterDialogBox>
    </FadeInOut>
  );
};
