import { FC, ReactNode, useState } from "react";

import { text } from "../../assets";
import {
  ColorSelector,
  Filters,
  HorizontalDivider,
  Label,
  LoadingPage,
  PriceSelector,
  Select,
  ItemShopCard,
  OverviewEmpty,
  Overlay,
  ButtonText,
  FadeInOut,
  LoadMore,
} from "../../components";
import { MAX_PRICE, MIN_PRICE, PAGE_SIZE } from "../../constants";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { useItemsMarketPage } from "../../service";
import { colors } from "../../service/fake-item-data";
import { itemCategories, sorting } from "../../assets/text/filter-options";
import {
  DetailContainer,
  FilterContainer,
  FilterWrapper,
  ItemContainer,
  ItemWrapper,
  LoadMoreWrapper,
  OverviewContainer,
  SelectorContainer,
  SortByContainer,
} from "./styles";
import { ItemInMarket } from "../../interfaces";
import { ItemDetailSection } from "../../containers/detail-section";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";
import { useAgoricState } from "../../context/agoric";
import { useItemStateDispatch } from "../../context/items";

interface Props {
  pageSelector: ReactNode;
}

export const ItemsShop: FC<Props> = ({ pageSelector }) => {
  const { height } = useViewport();
  const navigate = useNavigate();
  const [filterId, setFilterId] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemInMarket>();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number }>({ min: MIN_PRICE, max: MAX_PRICE });
  const [close, setClose] = useState(false);
  const [page, setPage] = useState(1);
  const { contracts: { characterBuilder } } = useAgoricState();
  const itemDispatch = useItemStateDispatch();
  const [items, isLoading] = useItemsMarketPage(page, {
    category: selectedCategory,
    sorting: selectedSorting,
    price: selectedPrice,
    color: selectedColor,
  });

  const noFilteredItems =
    (!selectedCategory.length || !selectedSorting.length || !selectedColor.length || !selectedPrice) && (!items || !items.length);

  const handlePriceChange = (min: number, max: number) => {
    setSelectedPrice({ min: min, max: max });
  };

  const buy = () => {
    if (!selectedItem) return;
    navigate(`${routes.buyItem}/${selectedItem.id}`);
  };

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };

  // FIXME: Still needed?
  const loadMore = async () => {
    setPage(prevState => prevState + 1);
  };

  return (
    <>
      <FilterWrapper>
        <FilterContainer>
          <SelectorContainer>
            {pageSelector}
            <Filters label={selectedCategory || text.filters.category} openFilter={openFilter} id={filterId} hasValue={!!selectedCategory}>
              <Select label={text.filters.allCategories} handleChange={setSelectedCategory} options={itemCategories} />
            </Filters>
            {/* TODO: get actual min and max values */}
            <Filters label={text.filters.price} openFilter={openFilter} id={filterId}>
              <PriceSelector handleChange={handlePriceChange} min={MIN_PRICE} max={MAX_PRICE} />
            </Filters>
            <Filters label={text.filters.color} openFilter={openFilter} id={filterId}>
              <ColorSelector handleChange={setSelectedColor} colors={colors} />
            </Filters>
          </SelectorContainer>
          <SortByContainer>
            <Label customColor={color.black}>{text.filters.sortBy}</Label>
            <Filters label={selectedSorting || text.filters.latest} openFilter={openFilter} id={filterId} hasValue={!!selectedSorting}>
              <Select label={text.filters.latest} handleChange={setSelectedSorting} options={sorting} />
            </Filters>
          </SortByContainer>
        </FilterContainer>
        <ButtonText customColor={color.darkGrey}>{text.param.amountOfItems(items.length)}</ButtonText>
        <HorizontalDivider />
      </FilterWrapper>
      {isLoading ? (
        <LoadingPage spinner={false} />
      ) : (
        <>
          {!items ||
            (!items.length && (
              <OverviewContainer>
                <OverviewEmpty
                  headingText={text.store.thereAreNoItemsInTheShop}
                  descriptionText={text.store.thereAreNoItemsAvailable}
                  buttonText={text.navigation.goHome}
                  redirectRoute={routes.character}
                  secondary
                />
              </OverviewContainer>
            ))}
          {!noFilteredItems && (
            <ItemWrapper height={height} onBlur={() => setFilterId("")}>
              <ItemContainer>
                {items.map((item) => (
                  <ItemShopCard itemInMarket={item} key={item.id} onClick={setSelectedItem} />
                ))}
              </ItemContainer>
              <LoadMoreWrapper>
                {items.length >= (PAGE_SIZE*page) && <LoadMore isLoading={isLoading} page={page} loadMore={loadMore} />}
              </LoadMoreWrapper>
            </ItemWrapper>
          )}
          <FadeInOut show={!!selectedItem} exiting={close}>
            {!!selectedItem && (
              <DetailContainer>
                <ItemDetailSection
                  item={selectedItem.item}
                  actions={{
                    onClose: () => {
                      setSelectedItem(undefined);
                      setClose(true);
                    },
                    price: Number(selectedItem.sell.price),
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
