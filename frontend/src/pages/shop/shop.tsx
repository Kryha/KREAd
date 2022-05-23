import { FC, useState } from "react";
import { text } from "../../assets";
import { BaseRoute, ButtonText, CharacterShopCard, ColorSelector, ErrorView, Filters, HorizontalDivider, Label, LoadingPage, PriceSelector, SecondaryButton, Select, ShopCard, SwitchSelector, Title } from "../../components";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { useCharacters, useItems } from "../../service";
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
  const [viewItems, setViewItems] = useState(true);
  const { data: items, isLoading: isLoadingItems } = useItems();
  const { data: characters, isLoading: isLoadingCharacters } = useCharacters();
  const { height } = useViewport();

  if (isLoadingItems || isLoadingCharacters) return <LoadingPage />;

  if (!items || !items.length || !characters || !characters.length) return <ErrorView />;

  const handleChange = (selected: string) => {
    // TODO: send to backend for some magic
    console.log(selected);
  };

  const handlePriceChange = (min: number, max: number) => {
    // TODO: send to backend for some magic
    console.log(min, max);
  };

  const handleView = (changeView: boolean) => {
    // TODO: send to backend for some magic
    setViewItems(!changeView);
  };

  return (
    <BaseRoute sideNavigation={<Title items={items.length} title={text.navigation.shop} />}>
      <ShopWrapper>
        <FilterWrapper>
          <FilterContainer>
            <SelectorContainer>
              <SwitchSelector buttonOneText={text.character.items} buttonTwoText={text.character.characters} handleView={handleView} />
              {Boolean(viewItems) && (
                <Filters label={text.filters.category}><Select label={text.filters.allCategories} handleChange={handleChange} options={categories} /></Filters>
              )}
              {/* TODO: get actual min and max values */}
              < Filters label={text.filters.price}><PriceSelector handleChange={handlePriceChange} min={0} max={1000} /></Filters>
              <Filters label={text.filters.color}><ColorSelector handleChange={handleChange} /></Filters>
            </SelectorContainer>
            <SortByContainer>
              <Label customColor={color.black}>{text.filters.sortBy}</Label>
              <Filters label={text.filters.latest}><Select label={text.filters.latest} handleChange={handleChange} options={sorting} /></Filters>
            </SortByContainer>
          </FilterContainer>
          <HorizontalDivider />
        </FilterWrapper>
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
      </ShopWrapper>
    </BaseRoute >
  );
};
