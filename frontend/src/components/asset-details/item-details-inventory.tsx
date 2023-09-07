import { FadeInOut } from "../fade-in-out";
import { DetailContainer } from "../../pages/shop/styles";
import { ItemDetailSection } from "../../containers/detail-section";
import { Overlay } from "../atoms";
import { FC, useState } from "react";
import { text } from "../../assets";
import { useEquipItem, useUnequipItem } from "../../service";
import { routes } from "../../navigation";
import { useNavigate } from "react-router-dom";
import { NotificationWrapper } from "../notification-detail/styles";
import { NotificationDetail } from "../notification-detail";
import { ErrorView } from "../error-view";
import { SECTION } from "../../constants";
import { Item, ItemCategory } from "../../interfaces";

interface ItemDetailsInventoryProps {
  section: (typeof SECTION)[keyof typeof SECTION];
  item: Item;
  selectedItem: { name: string; category: ItemCategory | undefined };
  selectItem: (name: string, category: ItemCategory | undefined) => void;
}
export const ItemDetailsInventory: FC<ItemDetailsInventoryProps> = ({ section, item, selectedItem, selectItem }) => {
  const navigate = useNavigate();
  const [close, setClose] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  if (equipItem.isError || unequipItem.isError) return <ErrorView />;
  const equipAsset = () => {
    // if (!assetId) return;
    setShowToast(!showToast);
    equipItem.mutate({ item });
  };

  const unequipAsset = () => {
    // if (!assetId) return;
    setShowToast(!showToast);
    unequipItem.mutate({ item });
  };

  const sellAsset = () => {
    // if (!assetId) return;
    navigate(`${routes.sellItem}/${item.category}/${item.name}`);
  };

  const assetDetailActions = () => {
    if (item.equippedTo) {
      return { primary: { text: text.item.unequip, onClick: unequipAsset } };
    } else if (item.forSale) {
      return { primary: { text: text.item.equip, onClick: equipAsset }, secondary: { text: text.item.sell, onClick: sellAsset } };
    }
  };


  return (
    <>
      <FadeInOut show={!!selectedItem} exiting={close}>
        {!!selectedItem && (
          <DetailContainer>
            <ItemDetailSection
              item={item}
              actions={{
                onClose: () => {
                  selectItem("", undefined);
                  setClose(true);
                },
                primary: assetDetailActions()?.primary,
                secondary: assetDetailActions()?.secondary,
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
    </>
  );
};
