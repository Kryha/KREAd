import { FC, ReactNode, useState } from "react";

import { text } from "../../assets";
import {
  Filters,
  HorizontalDivider,
  Label,
  LoadingPage,
  Overlay,
  PriceSelector,
  Select,
  ButtonText,
  FadeInOut,
  NotificationDetail,
} from "../../components";
import { MAX_PRICE, MIN_PRICE } from "../../constants";
import { color } from "../../design";
import { characterCategories, sorting } from "../../assets/text/filter-options";
import { FilterContainer, FilterWrapper, NotificationContainer, SelectorContainer, SortByContainer } from "./styles";
import { useCharactersMarket } from "../../service";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { CharactersShopDetail } from "./character-shop-detail";


interface Props {
  pageSelector: ReactNode;
}

export const CharactersShop: FC<Props> = ({ pageSelector }) => {
  const [filterId, setFilterId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number }>({ min: MIN_PRICE, max: MAX_PRICE });
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(1);

  const [characters, isLoading] = useCharactersMarket({
    category: selectedCategory,
    sorting: selectedSorting,
    price: selectedPrice,
  });

  const handlePriceChange = (min: number, max: number) => {
    setSelectedPrice({ min: min, max: max });
  };

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };

  // FIXME:  still needed?
  const loadMore = () => {
    setPage(prevState => prevState + 1);
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
        <LoadingPage spinner={false} />
      ) : (
        <CharactersShopDetail
          characters={characters}
          totalPages={1}//totalPages}
          isLoading={isLoading}
          selectedCategory={selectedCategory}
          selectedSorting={selectedSorting}
          selectedPrice={selectedPrice}
          setShowToast={setShowToast}
          page={page}
          loadMore={loadMore}
        />
      )}
      <FadeInOut show={showToast} exiting={!showToast}>
        {showToast && <Overlay isOnTop={true} />}
        <NotificationContainer>
          <NotificationWrapper showNotification={showToast}>
            <NotificationDetail
              title={text.general.goToYourWallet}
              info={text.general.yourActionIsPending}
              closeToast={() => setShowToast(false)}
              isError
            />
          </NotificationWrapper>
        </NotificationContainer>
      </FadeInOut>
    </>
  );
};
