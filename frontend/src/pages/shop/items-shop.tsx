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
  Select,
  ItemShopCard,
  Overlay,
} from "../../components";
import { MAX_PRICE, MIN_PRICE } from "../../constants";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { useFilteredItems } from "../../service";
import { colors } from "../../service/fake-item-data";
import { itemCategories, sorting } from "../../assets/text/filter-options";
import {
  FilterContainer,
  FilterWrapper,
  ItemContainer,
  ItemWrapper,
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
    navigate(`${routes.buyItem}/${selectedItem.id}`);
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
              <Select label={text.filters.allCategories} handleChange={setSelectedCategory} options={itemCategories} />
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
        <ButtonText customColor={color.darkGrey}>{text.param.amountOfItems(items.length)}</ButtonText>
        <HorizontalDivider />
      </FilterWrapper>
      {!!noFilteredItems || (
        <ItemWrapper height={height}>
          <ItemContainer>
            {items.map((item, index) => (
              <ItemShopCard item={item} key={index} onClick={setSelectedItem} />
            ))}
          </ItemContainer>
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
      {!!selectedItem && <Overlay />}
    </>
  );
};
