import { FC, useEffect, useState } from "react";

import { ButtonText, ColorSelector, Filters, HorizontalDivider, Label, LoadingPage, MenuItem, Select } from "../../components";
import { BaseFilterContainer, ColorContainer, ListContainer, ListHeader, SortableListWrap, SortContainer } from "./styles";

import { useFilteredItems } from "../../service";

import { text } from "../../assets";
import { itemCategories, sorting } from "../../assets/text/filter-options";
import { color } from "../../design";
import { colors } from "../../service/fake-item-data";

interface Props {
  onItemClick: (id: string) => void;
}

// TODO: Add filter & sortyng Hooks and components
export const ItemsList: FC<Props> = ({ onItemClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [filterId, setFilterId] = useState("");
  const [intitial, setInitial] = useState(true);

  const { data: items, isLoading } = useFilteredItems(selectedCategory, selectedSorting, { min: 0, max: 10000 }, selectedColor);


  useEffect(() => {
    if(items) {
      onItemClick(items[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <LoadingPage />;

  // TODO: get an empty section view
  if (!items || !items.length) return <></>;

  const handleCategoryChange = (selected: string) => {
    setSelectedCategory(selected);
  };

  const handleSortingChange = (selected: string) => {
    setSelectedSorting(selected);
  };

  const handleColorChange = (selected: string) => {
    setSelectedColor(selected);
  };

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };

  const removeInitial = () => {
    setInitial(false);
  };

  return (
    <SortableListWrap>
      <ListHeader>
        <BaseFilterContainer>
          <Filters label={text.filters.category} openFilter={openFilter} id={filterId}>
            <Select label={text.filters.allCategories} handleChange={handleCategoryChange} options={itemCategories} />
          </Filters>
          <ColorContainer>
            <Filters label={text.filters.color} openFilter={openFilter} id={filterId}>
              <ColorSelector handleChange={handleColorChange} colors={colors} />
            </Filters>
          </ColorContainer>
        </BaseFilterContainer>
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
        <MenuItem data={{ ...items[0], image: items[0].thumbnail }}  key={items[0].id} onClick={() => onItemClick(items[0].id)} isInitial={intitial} removeInitial={removeInitial} />
        {items.slice(1).map((item) => (
          <MenuItem data={{ ...item, image: item.thumbnail }}  key={item.id} onClick={() => onItemClick(item.id)} removeInitial={removeInitial} />
        ))}
      </ListContainer>
    </SortableListWrap>
  );
};
