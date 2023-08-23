import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ErrorView,
  FadeInOut,
  HorizontalDivider,
  LoadingPage,
  LoadMore,
  MenuItem,
  NotificationDetail,
  Overlay,
  OverviewEmpty,
} from "../../components";
import { routes } from "../../navigation";
import { useEquipItem, useItemFromInventory, useMyItems, useUnequipItem } from "../../service";
import { text } from "../../assets";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { DetailContainer, FilterContainer, FilterWrapper, LoadMoreWrapper, OverviewContainer, SelectorContainer } from "../shop/styles";
import { PAGE_SIZE } from "../../constants";
import { color } from "../../design";
import { useViewport } from "../../hooks";
import { FilterCount, ItemContainer, ItemInventoryWrapper } from "./styles";
import { FilterInventory } from "./filter-inventory";
import { colors } from "../../service/fake-item-data";
import { MobileFilter } from "./mobile-filter";
import { ItemDetailSection } from "../../containers/detail-section";

interface Props {
  pageSelector: React.ReactNode;
}
export const ItemsInventory: FC<Props> = ({ pageSelector }) => {
  const { height } = useViewport();
  const navigate = useNavigate();

  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  const [selectedId, setSelectedId] = useState<string>("");
  const [item] = useItemFromInventory(selectedId);
  const [showToast, setShowToast] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [initial, setInitial] = useState(true);
  const [filterId, setFilterId] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [close, setClose] = useState(false);
  const [page, setPage] = useState(1);
  const [items, isLoading] = useMyItems({
    categories: selectedCategories,
    sorting: selectedSorting,
    color: selectedColor,
  });

  const handleCategoryChange = (selected: string | string[]) => {
    if (Array.isArray(selected)) {
      setSelectedCategories(selected); // Handle multi-select
    } else {
      setSelectedCategories([selected]); // Handle single-select
    }
  };

  const handleSortingChange = (selected: string | string[]) => {
    setSelectedSorting(selected as string);
  };

  const equip = () => {
    if (!selectedId) return;
    setShowToast(!showToast);
    equipItem.mutate({ itemId: selectedId });
  };

  const unequip = () => {
    if (!selectedId) return;
    setShowToast(!showToast);
    unequipItem.mutate({ itemId: selectedId });
  };

  const sell = () => {
    if (!selectedId) return;
    navigate(`${routes.sellItem}/${selectedId}`);
  };

  if (isLoading) return <LoadingPage />;

  if (equipItem.isError || unequipItem.isError) return <ErrorView />;

  const detailActions = () => {
    if (item?.isEquipped) {
      return { primary: { text: text.item.unequip, onClick: unequip } };
    } else if (item?.isForSale) {
      return { primary: { text: text.item.equip, onClick: equip }, secondary: { text: text.item.sell, onClick: sell } };
    }
  };

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };

  const openFilters = () => {
    setShowFilter(!showFilter);
  };

  const removeInitial = () => {
    setInitial(false);
  };
  const loadMore = async () => {
    setPage((prevState) => prevState + 1);
  };

  const numberOfFiltersSelected = selectedCategories.length;

  return (
    <>
      <FilterWrapper>
        <FilterContainer>
          <SelectorContainer>
            {pageSelector}
            <FilterInventory
              selectedCategories={selectedCategories}
              selectedSorting={selectedSorting}
              handleCategoryChange={handleCategoryChange}
              handleSortingChange={handleSortingChange}
              setSelectedColor={setSelectedColor}
              colors={colors}
              filterId={filterId}
              openFilter={openFilter}
              openFilters={openFilters}
              numberOfFiltersSelected={numberOfFiltersSelected}
            />
          </SelectorContainer>
        </FilterContainer>
        <FilterCount customColor={color.darkGrey}>{text.param.amountOfItems(items.length)}</FilterCount>
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
                  headingText={text.item.noItemsInInventory}
                  descriptionText={text.item.buyItemsFromStore}
                  buttonText={text.navigation.shop}
                  redirectRoute={routes.shop}
                  secondary
                />
              </OverviewContainer>
            ))}
          {items.length > 0 && (
            <ItemInventoryWrapper height={height} onBlur={() => setFilterId("")}>
              <ItemContainer>
                {items.map((item) => (
                  <MenuItem
                    data={{ ...item, image: item.thumbnail }}
                    key={item.id}
                    onButtonClick={detailActions}
                    onClick={() => setSelectedId(item.id)}
                    removeInitial={removeInitial}
                    isEquipped={item.isEquipped}
                    isForSale={item.isForSale}
                  />
                ))}
                <LoadMoreWrapper>
                  {items.length > PAGE_SIZE * page && <LoadMore isLoading={isLoading} page={page} loadMore={loadMore} />}
                </LoadMoreWrapper>
              </ItemContainer>
            </ItemInventoryWrapper>
          )}
          <FadeInOut show={!!selectedId} exiting={close}>
            {!!selectedId && (
              <DetailContainer>
                <ItemDetailSection
                  item={item}
                  actions={{
                    onClose: () => {
                      setSelectedId("");
                      setClose(true);
                    },
                    primary: detailActions()?.primary,
                    secondary: detailActions()?.secondary,
                  }}
                />
              </DetailContainer>
            )}
            <Overlay />
          </FadeInOut>
          <FadeInOut show={showToast} exiting={!showToast}>
            {showToast && <Overlay isOnTop={true} />}
            <NotificationWrapper showNotification={showToast}>
              <NotificationDetail
                title={text.general.goToYourWallet}
                info={text.general.yourActionIsPending}
                closeToast={() => setShowToast(false)}
                isError
              />
            </NotificationWrapper>
          </FadeInOut>
          {showFilter && (
            <MobileFilter
              items={items}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              handleCategoryChange={handleCategoryChange}
              handleSortingChange={handleSortingChange}
            />
          )}
        </>
      )}
    </>
  );
};
