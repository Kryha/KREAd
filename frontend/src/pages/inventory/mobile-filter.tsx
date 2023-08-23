import { useViewport } from "../../hooks";
import { ButtonContainer } from "../../components/input-fields/styles";
import { ButtonText, FadeInOut, Overlay, PrimaryButton, SecondaryButton } from "../../components";
import { text } from "../../assets";
import { color, fontSize, margins } from "../../design";
import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { ArrowContainer, Close, Divider, DividerContainer, ReturnContainer } from "../../components/notification-detail/styles";
import { ItemEquip } from "../../interfaces";
import { itemCategories, sortingInventory } from "../../assets/text/filter-options";
import { filterItems } from "../../util";

interface FilterProps {
  items: ItemEquip[];
  handleCategoryChange: (selected: string[]) => void;
  handleSortingChange: (selected: string) => void;
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
}
export const MobileFilter: FC<FilterProps> = ({ items, showFilter, setShowFilter, handleCategoryChange, handleSortingChange }) => {
  const { height, width } = useViewport();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // State for selected categories
  const [selectedSorting, setSelectedSorting] = useState<string>(""); // State for selected sorting

  // Apply filters and get filtered items
  const filteredItems = filterItems(items, {
    categories: selectedCategories,
    sorting: selectedSorting,
    color: "", // You can provide the appropriate color if needed
  });

  const filteredItemCount = filteredItems.length;

  // Toggle a category in selectedCategories
  const toggleCategory = (category: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category) ? prevSelected.filter((item) => item !== category) : [...prevSelected, category]
    );
  };

  return (
    <FadeInOut show={showFilter} exiting={!showFilter}>
      {showFilter && <Overlay isOnTop={true} />}
      <FilterBox height={height} width={width}>
        <ButtonContainer>
          <DividerContainer>
            <ReturnContainer>
              <Divider />
              <ArrowContainer>
                <Close onClick={() => setShowFilter(false)} />
              </ArrowContainer>
            </ReturnContainer>
          </DividerContainer>
        </ButtonContainer>
        <FilterDialogWrapper>
          <FilterContainer>
            <FilterTitle>{text.filters.categories}</FilterTitle>
            <FilterSection>
              {itemCategories.map((category) => (
                <ToggleFilterButton
                  key={category.value}
                  selected={selectedCategories.includes(category.value)}
                  onClick={() => toggleCategory(category.value)}
                >
                  {category.label}
                </ToggleFilterButton>
              ))}
            </FilterSection>
            <FilterTitle>{text.filters.sortBy}</FilterTitle>
            <FilterSection>
              {sortingInventory.map((sorting) => (
                <ToggleFilterButton
                  key={sorting.value}
                  selected={selectedSorting.includes(sorting.value)}
                  onClick={() => {
                    handleSortingChange(sorting.value); // Use handleCategoryToggle to toggle category selection
                  }}
                >
                  {sorting.label}
                </ToggleFilterButton>
              ))}
            </FilterSection>
          </FilterContainer>
        </FilterDialogWrapper>
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
            <ButtonText customColor={color.white}>{`Show ${filteredItemCount} items`}</ButtonText>
          </PrimaryButton>
        </ButtonContainer>
      </FilterBox>
    </FadeInOut>
  );
};

interface FilterViewProps {
  height: number;
  width: number;
  showFilter?: boolean;
}

export const FilterBox = styled.div<FilterViewProps>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000000;
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
  background: ${color.lightGrey};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${margins.medium};
  height: 100%;
  ${({ height }): string => `max-height: ${height}px;`};
  ${({ width }): string => `max-width: ${width}px;`};
  overflow: hidden;
`;

const FilterTitle = styled.div`
  font-size: ${fontSize.small};
  font-weight: bold;
  margin-bottom: ${margins.small};
  :first-letter {
    text-transform: capitalize;
  }
`;

const FilterSection = styled.div`
  display: flex;
  margin-bottom: ${margins.nano};
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${margins.small};
`;

export const FilterDialogWrapper = styled.div`
  display: flex;
  overflow-y: scroll;
  flex-direction: column;
`;
export const FilterContainer = styled.div`
  margin-bottom: 40px;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: ${margins.small};
`;

interface ToggleFilterButtonProps {
  selected: boolean;
}

const ToggleFilterButton = styled(SecondaryButton)<ToggleFilterButtonProps>`
  padding: 8px 16px;
  font-size: ${fontSize.tiny};
  background-color: ${({ selected }) => (selected ? color.grey : "")};
  color: ${({ selected }) => (selected ? color.white : color.black)};
  border: 1px solid ${color.grey};
  border-radius: ${margins.small};
  cursor: pointer;
  &:hover {
    background-color: ${({ selected }) => (selected ? color.grey : "")};
  }
  &:focus {
    outline: none;
  }
`;
