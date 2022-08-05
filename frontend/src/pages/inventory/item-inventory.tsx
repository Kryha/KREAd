import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ErrorView, FadeInOut, LoadingPage, NotificationDetail, Overlay } from "../../components";
import { PageContainer } from "../../components/page-container";
import { routes } from "../../navigation";
import { useEquipItem, useMyItem, useMyItems, useUnequipItem } from "../../service";
import { text } from "../../assets/text";
import { ItemsList } from "../../containers/items-list";
import { ItemDetailSection } from "../../containers/detail-section";
import { EmptyDetail, EmptyItemInventory } from "./empty-item-inventory";
import { DetailWrapper } from "./styles";
import { NotificationWrapper } from "../../components/notification-detail/styles";

export const ItemsInventory: FC = () => {
  const navigate = useNavigate();

  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  const [selectedId, setSelectedId] = useState<string>("");
  const [{ all: allItems }, isLoadingItems] = useMyItems();
  const [isLoading, setIsLoading] = useState(true);
  const [item] = useMyItem(selectedId);
  const [noItems, setNoItems] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isLoadingItems || selectedId) return;
    if (allItems.length) {
      setSelectedId(allItems[0].id.toString());
    }
    setIsLoading(false);
  }, [allItems, isLoadingItems, selectedId]);

  const equip = () => {
    if (!item) return;
    setShowToast(!showToast);
    equipItem.mutate({ itemId: item.id });
  };

  const unequip = () => {
    if (!item) return;
    setShowToast(!showToast);
    unequipItem.mutate({ itemId: item.id });
  };

  const sell = () => {
    if (!selectedId) return;
    navigate(`${routes.sellItem}/${selectedId}`);
  };

  if (isLoadingItems || isLoading) return <LoadingPage />;

  if (equipItem.isError || unequipItem.isError) return <ErrorView />;

  if (!item) return <EmptyItemInventory />;

  const detailActions = () => {
    if (item.isEquipped) {
      return { primary: { text: text.item.unequip, onClick: unequip } };
    } else {
      return { primary: { text: text.item.equip, onClick: equip }, secondary: { text: text.item.sell, onClick: sell } };
    }
  };

  const onFilterChange = (items: boolean) => {
    setNoItems(items);
  };

  return (
    <PageContainer sidebarContent={<ItemsList onItemClick={setSelectedId} onFilterClick={onFilterChange} />}>
      <FadeInOut show>
        <DetailWrapper>{noItems ? <EmptyDetail /> : <ItemDetailSection item={item} actions={detailActions()} />}</DetailWrapper>
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
    </PageContainer>
  );
};
