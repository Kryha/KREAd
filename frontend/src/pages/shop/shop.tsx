import { FC, useState } from "react";
import { text } from "../../assets";
import { BaseRoute, ButtonText, ErrorView, Filters, HorizontalDivider, Label, LoadingPage, SecondaryButton, ShopCard, SwitchSelector, Title } from "../../components";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { useItems } from "../../service";
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
  const { height } = useViewport();

  if (isLoadingItems) return <LoadingPage />;

  if (!items || !items.length) return <ErrorView />;

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
              {/* TODO: add filters children component */}
              {Boolean(viewItems) && (
                <Filters label={text.general.category}></Filters>
              )}
              <Filters label={text.general.price} />
              <Filters label={text.general.color} />
            </SelectorContainer>
            <SortByContainer>
              <Label customColor={color.black}>{text.general.sortBy}</Label>
              <Filters label={text.general.color} />
            </SortByContainer>
          </FilterContainer>
          <HorizontalDivider />
        </FilterWrapper>
        <ItemWrapper height={height}>
          <ItemContainer>
            {items.map((item, index) => (
              <ShopCard item={item} key={index} />
            ))}
          </ItemContainer>
          {/* TODO: do something with load more */}
          <LoadMore>
            <SecondaryButton><ButtonText>{text.general.loadMore}</ButtonText><Refresh /></SecondaryButton>
          </LoadMore>
        </ItemWrapper>
      </ShopWrapper>
    </BaseRoute>
  );
};
