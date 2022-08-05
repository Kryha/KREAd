import { FC, ReactNode, useState } from "react";

import { text } from "../../assets";
import {
  CharacterShopCard,
  Filters,
  HorizontalDivider,
  Label,
  LoadingPage,
  OverviewEmpty,
  Overlay,
  PriceSelector,
  Select,
  ButtonText,
  FadeInOut,
} from "../../components";
import { MAX_PRICE, MIN_PRICE } from "../../constants";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { characterCategories, sorting } from "../../assets/text/filter-options";
import { DetailContainer, FilterContainer, FilterWrapper, ItemContainer, ItemWrapper, SelectorContainer, SortByContainer } from "./styles";
import { CharacterInMarket } from "../../interfaces";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { useCharactersMarket } from "../../service";
import { getExtendedCharacter } from "../../service/util";
import { useCharacterContext } from "../../context/characters";

interface Props {
  pageSelector: ReactNode;
}

export const CharactersShop: FC<Props> = ({ pageSelector }) => {
  const { height } = useViewport();
  const navigate = useNavigate();
  const [{ owned }] = useCharacterContext();
  const [filterId, setFilterId] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInMarket>();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number }>({ min: MIN_PRICE, max: MAX_PRICE });
  const [close, setClose] = useState(false);

  const [characters, isLoading] = useCharactersMarket({
    category: selectedCategory,
    sorting: selectedSorting,
    price: selectedPrice,
  });

  const noFilteredCharacters =
    (!selectedCategory.length || !selectedSorting.length || !selectedPrice) && (!characters || !characters.length);

  const handlePriceChange = (min: number, max: number) => {
    setSelectedPrice({ min: min, max: max });
  };

  const buy = () => {
    if (!selectedCharacter) return;
    navigate(`${routes.buyCharacter}/${selectedCharacter.id}`);
  };

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };

  return (
    <>
      <FilterWrapper>
        <FilterContainer>
          <SelectorContainer>
            {pageSelector}
            <Filters label={selectedCategory || text.filters.category} openFilter={openFilter} id={filterId} hasValue={!!selectedCategory}>
              <Select label={text.filters.allCategories} handleChange={setSelectedCategory} options={characterCategories} />
            </Filters>
            {/* TODO: get actual min and max values */}
            <Filters label={text.filters.price} openFilter={openFilter} id={filterId}>
              <PriceSelector handleChange={handlePriceChange} min={MIN_PRICE} max={MAX_PRICE} />
            </Filters>
          </SelectorContainer>
          <SortByContainer>
            <Label customColor={color.black}>{text.filters.sortBy}</Label>
            <Filters label={selectedSorting || text.filters.latest} openFilter={openFilter} id={filterId} hasValue={!!selectedSorting}>
              <Select label={text.filters.latest} handleChange={setSelectedSorting} options={sorting} />
            </Filters>
          </SortByContainer>
        </FilterContainer>
        <ButtonText customColor={color.darkGrey}>{text.param.amountOfCharacters(!characters ? 0 : characters.length)}</ButtonText>
        <HorizontalDivider />
      </FilterWrapper>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          {!characters || !characters.length ? (
            <OverviewEmpty
              headingText={text.store.thereAreNoCharactersInTheShop}
              descriptionText={text.store.thereAreNoCharactersAvailable}
              buttonText={text.navigation.goHome}
              redirectRoute={routes.character}
            />
          ) : (
            <>
              {noFilteredCharacters && (
                <ItemWrapper height={height}>
                  <ItemContainer>
                    {characters.map((character) => (
                      <CharacterShopCard key={character.id} character={character} onClick={setSelectedCharacter} />
                    ))}
                  </ItemContainer>
                </ItemWrapper>
              )}
              {!noFilteredCharacters && (
                <ItemWrapper height={height}>
                  <ItemContainer>
                    {characters.map((character) => (
                      <CharacterShopCard key={character.id} character={character} onClick={setSelectedCharacter} />
                    ))}
                  </ItemContainer>
                </ItemWrapper>
              )}
            </>
          )}
          <FadeInOut show={!!selectedCharacter} exiting={close}>
            {!!selectedCharacter && (
              <DetailContainer>
                <CharacterDetailSection
                  character={getExtendedCharacter(selectedCharacter.character.name, owned )}
                  equippedItems={selectedCharacter.equippedItems}
                  actions={{
                    onClose: () => {
                      setSelectedCharacter(undefined);
                      setClose(true);
                    },
                    primary: { text: text.item.buy, onClick: buy },
                  }}
                />
              </DetailContainer>
            )}
            <Overlay />
          </FadeInOut>
        </>
      )}
    </>
  );
};
