import { FC, useState } from "react";
import { text } from "../../assets";
import { BaseRoute, ButtonText, CharacterShopCard, ColorSelector, ErrorView, Filters, HorizontalDivider, Label, LoadingPage, PriceSelector, SecondaryButton, Select, ShopCard, SwitchSelector, Title } from "../../components";
import { MAX_PRICE, MIN_PRICE } from "../../constants";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { useCharacters, useFilteredItems } from "../../service";
import { colors } from "../../service/fake-item-data";
import { categories, sorting } from "./filter-options";
import {
  FilterContainer,
  FilterWrapper,
  ItemContainer,
  ItemWrapper,
  LoadMore,
  Refresh,
  SelectorContainer,
  ShopWrapper,
  SortByContainer
} from "./styles";


export const Shop: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number }>({ min: MIN_PRICE, max: MAX_PRICE });
  const [viewItems, setViewItems] = useState(true);
  const { data: items, isLoading: isLoadingItems } = useFilteredItems(selectedCategory, selectedSorting, selectedPrice, selectedColor);
  const { data: characters, isLoading: isLoadingCharacters } = useCharacters();
  const { height } = useViewport();
  const noFilteredItems = (!selectedCategory.length || !selectedSorting.length || !selectedColor.length || !selectedPrice) && (!items || !items.length);
  if (isLoadingItems || isLoadingCharacters) return <LoadingPage />;

  if (!characters || !characters.length) return <ErrorView />;

  const handleColorChange = (selected: string) => {
    setSelectedColor(selected);
  };

  const handleSortingChange = (selected: string) => {
    setSelectedSorting(selected);
  };

  const handleCategoryChange = (selected: string) => {
    setSelectedCategory(selected);
  };

  const handlePriceChange = (min: number, max: number) => {
    setSelectedPrice({ min: min, max: max });
  };

  const handleView = (changeView: boolean) => {
    setViewItems(!changeView);
    setSelectedColor("");
    setSelectedSorting("");
    setSelectedCategory("");
    setSelectedPrice({ min: MIN_PRICE, max: MAX_PRICE });
  };

  return (
    <BaseRoute sideNavigation={<Title items={items.length} title={text.navigation.shop} />}>
      <ShopWrapper>
        <FilterWrapper>
          <FilterContainer>
            <SelectorContainer>
              <SwitchSelector buttonOneText={text.character.items} buttonTwoText={text.character.characters} handleView={handleView} />
              {Boolean(viewItems) && (
                <Filters label={text.filters.category}><Select label={text.filters.allCategories} handleChange={handleCategoryChange} options={categories} /></Filters>
              )}
              {/* TODO: get actual min and max values */}
              <Filters label={text.filters.price}><PriceSelector handleChange={handlePriceChange} min={MIN_PRICE} max={MAX_PRICE} /></Filters>
              <Filters label={text.filters.color}><ColorSelector handleChange={handleColorChange} colors={colors} /></Filters>
            </SelectorContainer>
            <SortByContainer>
              <Label customColor={color.black}>{text.filters.sortBy}</Label>
              <Filters label={text.filters.latest}><Select label={text.filters.latest} handleChange={handleSortingChange} options={sorting} /></Filters>
            </SortByContainer>
          </FilterContainer>
          <HorizontalDivider />
        </FilterWrapper>
        {noFilteredItems ? <></> :
          <ItemWrapper height={height}>
            {viewItems ?
              <>
                <ItemContainer>
                  {items.map((item, index) => (
                    <ShopCard item={item} key={index} />
                  ))}
                </ItemContainer>
                {/* TODO: do something with load more */}
                <LoadMore>
                  <SecondaryButton><ButtonText>{text.general.loadMore}</ButtonText><Refresh /></SecondaryButton>
                </LoadMore>
              </>
              : <>
                <ItemContainer>
                  {characters.map((character, index) => (
                    <CharacterShopCard character={character} key={index} />
                  ))}
                </ItemContainer>
                {/* TODO: do something with load more */}
                <LoadMore>
                  <SecondaryButton><ButtonText>{text.general.loadMore}</ButtonText><Refresh /></SecondaryButton>
                </LoadMore>
              </>}
          </ItemWrapper>
        }
      </ShopWrapper>
    </BaseRoute>
  );
};
