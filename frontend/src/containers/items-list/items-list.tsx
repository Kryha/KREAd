import { FC, useState } from "react";

import { ButtonText, Filters, Label, LoadingPage, MenuItem, Select } from "../../components";
import { ListContainer, ListHeader, ListHeaderContainer, SortableListWrap, SortContainer } from "./styles";

import { useFilteredItems } from "../../service";

import { text } from "../../assets";
import { categories, sorting } from "../../assets/text/filter-options";
import { color } from "../../design";

interface Props {
  onItemClick: (id: string) => void;
}

// TODO: Add filter & sortyng Hooks and components

export const ItemsList: FC<Props> = ({ onItemClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");

  const { data: items, isLoading } = useFilteredItems(selectedCategory, selectedSorting, { min: 0, max: 10000 }, "");

  if (isLoading) return <LoadingPage />;

  // TODO: get an empty section view
  if (!items || !items.length) return <></>;

  const handleCategoryChange = (selected: string) => {
    setSelectedCategory(selected);
  };

  const handleSortingChange = (selected: string) => {
    setSelectedSorting(selected);
  };

  return (
    <SortableListWrap>
      <ListHeaderContainer>
        <ListHeader>
          <Filters label={text.filters.category}>
            <Select label={text.filters.allCategories} handleChange={handleCategoryChange} options={categories} />
          </Filters>
          <SortContainer>
            <Label>{text.filters.sortBy}</Label>
            <Filters label={text.filters.latest}>
              <Select label={text.filters.latest} handleChange={handleSortingChange} options={sorting} />
            </Filters>
          </SortContainer>
        </ListHeader>
        <ButtonText customColor={color.darkGrey}>{text.param.amountOfItems(items.length)}</ButtonText>
      </ListHeaderContainer>
      <ListContainer>
        {items.map((item) => (
          <MenuItem data={item} key={item.id} onClick={() => onItemClick(item.id)} />
        ))}
      </ListContainer>
    </SortableListWrap>
  );
};
