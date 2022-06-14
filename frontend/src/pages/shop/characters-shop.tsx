import { FC, ReactNode, useState } from "react";

import { text } from "../../assets";
import {
  ButtonText,
  CharacterShopCard,
  ErrorView,
  Filters,
  HorizontalDivider,
  Label,
  LoadingPage,
  PriceSelector,
  SecondaryButton,
  Select,
} from "../../components";
import { MAX_PRICE, MIN_PRICE } from "../../constants";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { useCharacters } from "../../service";
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
import { Character } from "../../interfaces";
import { CharacterDetailSection } from "../../containers/detail-section";

interface Props {
  pageSelector: ReactNode;
}

export const CharactersShop: FC<Props> = ({ pageSelector }) => {
  const { height } = useViewport();

  const [selectedCharacter, setSelectedCharacter] = useState<Character>();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number }>({ min: MIN_PRICE, max: MAX_PRICE });

  // TODO: actually use character filters
  const { data: characters, isLoading: isLoading } = useCharacters();

  const noFilteredCharacters =
    (!selectedCategory.length || !selectedSorting.length || !selectedPrice) && (!characters || !characters.length);

  const handlePriceChange = (min: number, max: number) => {
    setSelectedPrice({ min: min, max: max });
  };

  const buy = () => {
    // TODO: implement character buy
    console.log("TODO: implement character buy");
  };

  if (isLoading) return <LoadingPage />;

  if (!characters || !characters.length) return <ErrorView />;

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
      {noFilteredCharacters || (
        <ItemWrapper height={height}>
          <ItemContainer>
            {characters.map((character, index) => (
              <CharacterShopCard character={character} key={index} onClick={setSelectedCharacter} />
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
      {!!selectedCharacter && (
        <CharacterDetailSection
          character={selectedCharacter}
          actions={{ onClose: () => setSelectedCharacter(undefined), primary: { text: text.item.buy, onClick: buy } }}
        />
      )}
    </>
  );
};
