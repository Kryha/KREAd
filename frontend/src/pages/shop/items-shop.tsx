import { FC, ReactNode, useState } from "react";

import { text } from "../../assets";
import {
  ButtonText,
  ColorSelector,
  ErrorView,
  Filters,
  HorizontalDivider,
  Label,
  LoadingPage,
  PriceSelector,
  SecondaryButton,
  Select,
  ShopCard,
} from "../../components";
import { MAX_PRICE, MIN_PRICE } from "../../constants";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { useFilteredItems } from "../../service";
import { colors } from "../../service/fake-item-data";
import { categories, sorting } from "../../assets/text/filter-options";
import {
  FilterContainer,
  FilterWrapper,
  ItemContainer,
  ItemWrapper,
  LoadMore,
  Refresh,
  SelectorContainer,
  SortByContainer,
} from "./styles";
import { Item } from "../../interfaces";
import { ItemDetailSection } from "../../containers/detail-section";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";

interface Props {
  pageSelector: ReactNode;
}

export const ItemsShop: FC<Props> = ({ pageSelector }) => {
  const { height } = useViewport();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState<Item>();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number }>({ min: MIN_PRICE, max: MAX_PRICE });

  const { data: items, isLoading: isLoading } = useFilteredItems(selectedCategory, selectedSorting, selectedPrice, selectedColor);

  const noFilteredItems =
    (!selectedCategory.length || !selectedSorting.length || !selectedColor.length || !selectedPrice) && (!items || !items.length);

  const handlePriceChange = (min: number, max: number) => {
    setSelectedPrice({ min: min, max: max });
  };

  const buy = () => {
    if (!selectedItem) return;
    navigate(`${routes.buy}/${selectedItem.id}`);
  };

  if (isLoading) return <LoadingPage />;

  if (!items || !items.length) return <ErrorView />;

  return (
    <>
      <FilterWrapper>
        <FilterContainer>
          <SelectorContainer>
            {pageSelector}
            <Filters label={text.filters.category}>
              <Select label={text.filters.allCategories} handleChange={setSelectedCategory} options={categories} />
            </Filters>
            {/* TODO: get actual min and max values */}
            <Filters label={text.filters.price}>
              <PriceSelector handleChange={handlePriceChange} min={MIN_PRICE} max={MAX_PRICE} />
            </Filters>
            <Filters label={text.filters.color}>
              <ColorSelector handleChange={setSelectedColor} colors={colors} />
            </Filters>
          </SelectorContainer>
          <SortByContainer>
            <Label customColor={color.black}>{text.filters.sortBy}</Label>
            <Filters label={text.filters.latest}>
              <Select label={text.filters.latest} handleChange={setSelectedSorting} options={sorting} />
            </Filters>
          </SortByContainer>
        </FilterContainer>
        <HorizontalDivider />
      </FilterWrapper>
      {!!noFilteredItems || (
        <ItemWrapper height={height}>
          <ItemContainer>
            {items.map((item, index) => (
              <ShopCard item={item} key={index} onClick={setSelectedItem} />
            ))}
          </ItemContainer>
          {/* TODO: do something with load more */}
          <LoadMore>
            <SecondaryButton>
              <ButtonText>{text.general.loadMore}</ButtonText>
              <Refresh />
            </SecondaryButton>
          </LoadMore>
        </ItemWrapper>
      )}
      {!!selectedItem && (
        <ItemDetailSection
          item={selectedItem}
          actions={{
            onClose: () => setSelectedItem(undefined),
            price: selectedItem.price,
            primary: { text: text.item.buy, onClick: buy },
          }}
        />
      )}
    </>
  );
};
