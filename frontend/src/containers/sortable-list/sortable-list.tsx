import { Dispatch, FC, SetStateAction, useState } from "react";

import { Filters, Label, LoadingPage, MenuItem, Select } from "../../components";
import { ListContainer, ListHeader, SortableListWrap, SortContainer } from "./styles";

import { useFilteredItems } from "../../service";

import { Item } from "../../interfaces";
import { text } from "../../assets";
import { categories, sorting } from "../../assets/text/filter-options";

interface SortableListProps {
  list: Item[];
  setElementId: Dispatch<SetStateAction<string>>;
}

// TODO: Add filter & sortyng Hooks and components

export const SortableList: FC<SortableListProps> = ({ setElementId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");

  const { data: items, isLoading } = useFilteredItems(selectedCategory, selectedSorting, { min: 0, max: 10000 }, "");

  if (isLoading) return <LoadingPage />;

  // TODO: get an empty section view
  // if (!items) return <></>;

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
          <MenuItem item={item} key={item.id} onClick={() => setElementId(item.id)} />
        ))}
      </ListContainer>
    </SortableListWrap>
  );
};
