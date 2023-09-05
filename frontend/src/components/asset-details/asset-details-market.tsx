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
import { ItemCategory, ItemInMarket } from "../../interfaces";

interface AssetDetailsProps {
  section: (typeof SECTION)[keyof typeof SECTION];
  itemInMarket: ItemInMarket;
  assetId: string;
  selectItem: (name: string, category: ItemCategory | undefined) => void;
}
export const AssetDetails: FC<AssetDetailsProps> = ({ section, itemInMarket, assetId, selectItem }) => {
  const navigate = useNavigate();
  const [close, setClose] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  if (equipItem.isError || unequipItem.isError) return <ErrorView />;
  const equipAsset = () => {
    setShowToast(!showToast);
    equipItem.mutate({ item: itemInMarket.item });
  };

  const unequipAsset = () => {
    setShowToast(!showToast);
    unequipItem.mutate({ item: itemInMarket.item });
  };

  const sellAsset = () => {
    navigate(`${routes.sellItem}/${itemInMarket.item.category}/${itemInMarket.item.name}`);
  };

  const buyAsset = () => {
    navigate(`${routes.buyItem}/${itemInMarket.item.category}/${itemInMarket.item.name}`);
  };
  const assetDetailActions = () => {
    if (section === "inventory") {
      if (itemInMarket?.item.isEquipped) {
        return { primary: { text: text.item.unequip, onClick: unequipAsset } };
      } else if (itemInMarket?.item.forSale) {
        return { primary: { text: text.item.equip, onClick: equipAsset }, secondary: { text: text.item.sell, onClick: sellAsset } };
      }
    } else {
      return { primary: { text: text.item.buy, onClick: buyAsset }, price: Number(itemInMarket.sell.price) };
    }
  };

  let transformedData;
  if (section === "inventory") {
    console.log(itemInMarket)
    transformedData = itemInMarket.item;
  } else if (section === "shop") {
    transformedData = itemInMarket?.item;
  }

  return (
    <>
      <FadeInOut show={!!assetId} exiting={close}>
        {!!assetId && (
          <DetailContainer>
            <ItemDetailSection
              item={transformedData}
              actions={{
                onClose: () => {
                  selectItem("", undefined);
                  setClose(true);
                },
                price: assetDetailActions()?.price,
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
