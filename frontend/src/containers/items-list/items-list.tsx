import { FC, useState } from "react";

import { Filters, Label, LoadingPage, MenuItem, Select } from "../../components";
import { ListContainer, ListHeader, SortableListWrap, SortContainer } from "./styles";

import { useFilteredItems } from "../../service";

import { text } from "../../assets";
import { categories, sorting } from "../../assets/text/filter-options";

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
      <ListContainer>
        {items.map((item) => (
          <MenuItem data={item} key={item.id} onClick={() => onItemClick(item.id)} />
        ))}
      </ListContainer>
    </SortableListWrap>
  );
};
