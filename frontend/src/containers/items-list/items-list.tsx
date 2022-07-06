import { FC, useState } from "react";

import { ButtonText, Filters, HorizontalDivider, Label, LoadingPage, MenuItem, Select } from "../../components";
import { ListContainer, ListHeader, SortableListWrap, SortContainer } from "./styles";

import { useFilteredItems } from "../../service";

import { text } from "../../assets";
import { itemCategories, sorting } from "../../assets/text/filter-options";
import { color } from "../../design";

interface Props {
  onItemClick: (id: string) => void;
}

// TODO: Add filter & sortyng Hooks and components

export const ItemsList: FC<Props> = ({ onItemClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [filterId, setFilterId] = useState("");

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

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };


  return (
    <SortableListWrap>
      <ListHeader>
        <Filters label={text.filters.category} openFilter={openFilter} id={filterId}>
          <Select label={text.filters.allCategories} handleChange={handleCategoryChange} options={itemCategories} />
        </Filters>
        <SortContainer>
          <Label>{text.filters.sortBy}</Label>
          <Filters label={text.filters.latest} openFilter={openFilter} id={filterId}>
            <Select label={text.filters.latest} handleChange={handleSortingChange} options={sorting} />
          </Filters>
        </SortContainer>
      </ListHeader>
      <ButtonText customColor={color.darkGrey}>{text.param.amountOfItems(items.length)}</ButtonText>
      <HorizontalDivider />
      <ListContainer>
        {items.map((item) => (
          <MenuItem data={item} key={item.id} onClick={() => onItemClick(item.id)} />
        ))}
      </ListContainer>
    </SortableListWrap>
  );
};
