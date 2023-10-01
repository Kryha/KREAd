import { FadeInOut } from "../fade-in-out";
import { DetailContainer } from "../../pages/shop/styles";
import { ItemDetailSection } from "../../containers/detail-section";
import { Overlay } from "../atoms";
import { FC, useState } from "react";
import { text } from "../../assets";
import { routes } from "../../navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationWrapper } from "../notification-detail/styles";
import { NotificationDetail } from "../notification-detail";
import { ItemInMarket } from "../../interfaces";

interface ItemDetailsMarketProps {
  itemInMarket: ItemInMarket;
  selectItemInMarket: (id: string) => void;
}
export const ItemDetailsMarket: FC<ItemDetailsMarketProps> = ({ itemInMarket, selectItemInMarket }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [close, setClose] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const buyAsset = () => {
    navigate(`${routes.buyItem}/${itemInMarket.id}`, { state: location });
  };

  const { royalty, platformFee, price } = itemInMarket.sell;

  const totalPrice = Number(royalty + platformFee + price);

  const assetDetailActions = {
    primary: { text: text.item.buy, onClick: buyAsset },
    price: Number(itemInMarket.sell.price),
  };

  return (
    <>
      <FadeInOut show={!!itemInMarket.id} exiting={close}>
        <DetailContainer>
          <ItemDetailSection
            item={itemInMarket.item}
            actions={{
              onClose: () => {
                selectItemInMarket("");
                setClose(true);
              },
              price: totalPrice,
              primary: assetDetailActions.primary,
              secondary: undefined,
            }}
          />
        </DetailContainer>
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
