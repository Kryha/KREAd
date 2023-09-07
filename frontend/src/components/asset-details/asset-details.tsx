import { FadeInOut } from "../fade-in-out";
import { DetailContainer } from "../../pages/shop/styles";
import { ItemDetailSection } from "../../containers/detail-section";
import { Overlay } from "../atoms";
import React, { FC, useState } from "react";
import { text } from "../../assets";
import { useEquipItem, useUnequipItem } from "../../service";
import { routes } from "../../navigation";
import { useNavigate } from "react-router-dom";
import { NotificationWrapper } from "../notification-detail/styles";
import { NotificationDetail } from "../notification-detail";
import { ErrorView } from "../error-view";
import { SECTION } from "../../constants";

interface AssetDetailsProps {
  section: (typeof SECTION)[keyof typeof SECTION];
  assetData: any;
  assetId: string;
  setAssetId: (assetId: string) => void;
}
export const AssetDetails: FC<AssetDetailsProps> = ({ section, assetData, assetId, setAssetId }) => {
  const navigate = useNavigate();
  const [close, setClose] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  if (equipItem.isError || unequipItem.isError) return <ErrorView />;
  const equipAsset = () => {
    if (!assetId) return;
    setShowToast(!showToast);
    equipItem.mutate({ itemId: assetId });
  };

  const unequipAsset = () => {
    if (!assetId) return;
    setShowToast(!showToast);
    unequipItem.mutate({ itemId: assetId });
  };
  const sellAsset = () => {
    if (!assetId) return;
    navigate(`${routes.sellItem}/${assetId}`);
  };

  const buyAsset = () => {
    if (!assetId) return;
    navigate(`${routes.buyItem}/${assetId}`);
  };
  const assetDetailActions = () => {
    if (section === "inventory") {
      if (assetData?.isEquipped) {
        return { primary: { text: text.item.unequip, onClick: unequipAsset } };
      } else if (assetData?.isForSale) {
        return { primary: { text: text.item.equip, onClick: equipAsset }, secondary: { text: text.item.sell, onClick: sellAsset } };
      }
    } else {
      return { primary: { text: text.item.buy, onClick: buyAsset }, price: Number(assetData.sell.price) };
    }
  };

  let transformedData;
  if (section === "inventory") {
    transformedData = assetData;
  } else if (section === "shop") {
    transformedData = assetData?.item;
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
                  setAssetId("");
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
