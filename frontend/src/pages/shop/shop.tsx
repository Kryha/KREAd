import { FC } from "react";
import { RefreshIcon, text } from "../../assets";
import { BaseRoute, ErrorView, HorizontalDivider, Label, LoadingPage, SecondaryButton, Select, ShopCard, SwitchSelector } from "../../components";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { useItems } from "../../service";
import {
  FilterContainer,
  FilterWrapper,
  ItemContainer,
  ItemWrapper,
  LoadMore,
  SelectorContainer,
  ShopWrapper,
  SortByContainer
} from "./styles";

export const Shop: FC = () => {
  const handleChange = () => { };
  const { data: items, isLoading: isLoadingItems } = useItems();
  const { height } = useViewport();

  if (isLoadingItems) return <LoadingPage />;

  if (!items || !items.length) return <ErrorView />;

  return (
    // TODO: Add side bar component
    <BaseRoute sideNavigation={undefined}>
      <ShopWrapper>
        <FilterWrapper>
          <FilterContainer>
            <SelectorContainer>
              <SwitchSelector buttonOneText={text.character.items} buttonTwoText={text.character.characters} />
              <Select label={text.general.category} input={text.general.category} handleChange={() => handleChange()} options={[]} />
              <Select label={text.general.price} input={text.general.price} handleChange={() => handleChange()} options={[]} />
              <Select label={text.general.color} input={text.general.color} handleChange={() => handleChange()} options={[]} />
            </SelectorContainer>
            <SortByContainer>
              <Label customColor={color.black}>{text.general.sortBy}</Label>
              <Select label={text.general.color} input={text.general.color} handleChange={() => handleChange()} options={[]} />
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
          {/* TODO: do something with it */}
          <LoadMore>
            <SecondaryButton>{text.general.loadMore}<RefreshIcon /></SecondaryButton>
          </LoadMore>
        </ItemWrapper>
      </ShopWrapper>
    </BaseRoute>
  );
};
