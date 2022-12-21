import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage, Overlay, NotificationDetail } from "../../components";
import { ItemDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useMyItem, useSellItem } from "../../service";
import { Sell } from "./sell";

export const ItemSell = () => {
  const { id } = useParams<"id">();

  const idString = String(id);
  const [showToast, setShowToast] = useState(false);
  const [data, isLoading] = useMyItem(idString);
  const sellItem = useSellItem(idString);
  const navigate = useNavigate();

  const submitForm = async (price: number) => {
    const res = await sellItem.callback(price);
    if (res) {
      displayToast();
      console.info("Sell offer sent, redirecting to shop");
    } else {
      throw "There was a problem sending the sell offer to the wallet. Please try again later.";
    }
  };

  const displayToast = () => {
    setShowToast(true);
  };

  const closeAndRedirect = () => {
    setShowToast(false);
    navigate(`${routes.inventory}`);
  };

  if (sellItem.isError) return <ErrorView />;

  if (sellItem.isSuccess) return <Navigate to={routes.shop} />;

  if (isLoading) return <LoadingPage spinner={false} />;

  if (!data) return <ErrorView />;

  return (
    <Sell
      isLoading={sellItem.isLoading}
      onSubmit={submitForm}
      text={{ sell: text.store.sellItem }}
      data={{ ...data, image: data.thumbnail }}
    >
      <FadeInOut show>
        <ItemDetailSection item={data} />
      </FadeInOut>
      <FadeInOut show={showToast} exiting={!showToast}>
        {showToast && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showToast}>
          <NotificationDetail
            title={text.general.goToYourWallet}
            info={text.general.yourActionIsPending}
            closeToast={closeAndRedirect}
            isError
          />
        </NotificationWrapper>
      </FadeInOut>
    </Sell>
  );
};
