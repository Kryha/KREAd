import { FC, useEffect, useState } from "react";

import { ButtonText, ColorSelector, Filters, HorizontalDivider, Label, LoadingPage, MenuItem, Select } from "../../components";
import { BaseFilterContainer, ColorContainer, ListContainer, ListHeader, SortableListWrap, SortContainer } from "./styles";

import { useMyItems } from "../../service";

import { text } from "../../assets";
import { itemCategories, sortingInventory } from "../../assets/text/filter-options";
import { color } from "../../design";
import { colors } from "../../service/fake-item-data";
import { EmptyCard } from "../../components/empty-card";

interface Props {
  onItemClick: (id: string) => void;
  onFilterClick: (items: boolean) => void;
}

export const ItemsList: FC<Props> = ({ onItemClick, onFilterClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [filterId, setFilterId] = useState("");
  const [intitial, setInitial] = useState(true);

  const [{ all: items }, isLoading] = useMyItems({
    category: selectedCategory,
    sorting: selectedSorting,
    color: selectedColor,
  });

  useEffect(() => {
    onFilterClick(!items || !items.length);
  }, [items, onFilterClick]);

  if (isLoading) return <LoadingPage spinner={false} />;

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
          <Filters label={selectedCategory || text.filters.category} openFilter={openFilter} id={filterId} hasValue={!!selectedCategory}>
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
          <Filters label={selectedSorting || text.filters.latest} openFilter={openFilter} id={filterId} hasValue={!!selectedSorting}>
            <Select label={text.filters.latest} handleChange={handleSortingChange} options={sortingInventory} />
          </Filters>
        </SortContainer>
      </ListHeader>
      <ButtonText customColor={color.darkGrey}>{text.param.amountOfItems(items.length)}</ButtonText>
      <HorizontalDivider />
      {!!items && !!items.length && (
        <ListContainer>
          <MenuItem
            data={{ ...items[0], image: items[0].thumbnail }}
            key={items[0].id}
            onClick={() => onItemClick(items[0].id)}
            isInitial={intitial}
            removeInitial={removeInitial}
            isEquipped={items[0].isEquipped}
            isForSale={items[0].isForSale}
          />
          {items.slice(1).map((item) => (
            <MenuItem
              data={{ ...item, image: item.thumbnail }}
              key={item.id}
              onClick={() => onItemClick(item.id)}
              removeInitial={removeInitial}
              isEquipped={item.isEquipped}
              isForSale={item.isForSale}
            />
          ))}
        </ListContainer>
      )}
      {!items || (!items.length && <EmptyCard title={text.item.noItemsInInventory} description={text.item.buyItemsFromStore} />)}
    </SortableListWrap>
  );
};
