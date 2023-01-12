import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { ItemDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useMyItem, useSellItem } from "../../service";
import { Sell } from "./sell";
import { ToastGoToWallet } from "../../components/toast-go-to-wallet";
import { SellStep } from "./types";

export const ItemSell = () => {
  const { id } = useParams<"id">();

  const idString = String(id);
  const [showToast, setShowToast] = useState(false);
  const [data, isLoading] = useMyItem(idString);
  const [isError, setIsError] = useState(false);
  const sellItem = useSellItem(idString);
  const navigate = useNavigate();

  const [price, setPrice] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<SellStep>(0);

  const sendOfferHandler = async () => {
    console.log("sendOfferHandler", price);
    const res = await sellItem.callback(price);
    if (res) {
      console.info("Sell offer sent, redirecting to shop");
    } else {
      console.warn("There was a problem sending the sell offer to the wallet. Please try again later.");
      setIsError(true);
    }
  };

  const submitForm = async (price: number) => {
    const res = await sellItem.callback(price);
    if (res) {
      displayToast();
      console.info("Sell offer sent, redirecting to shop");
    } else {
      console.warn("There was a problem sending the sell offer to the wallet. Please try again later.");
      setIsError(true);
    }
  };

  const displayToast = () => {
    setShowToast(true);
  };

  const closeAndRedirect = () => {
    setShowToast(false);
    navigate(`${routes.inventory}`);
  };

  if (isError) return <ErrorView />;

  if (isLoading) return <LoadingPage spinner={false} />;

  // TODO: this prevents the page from trying to load an item that is no longer available
  // we'll be refactoring this to listen for the offer accepted action
  if (!data) closeAndRedirect();

  if (!data) return <ErrorView />;

  return (
    <h1>hi</h1>
    // <Sell
    //   data={{ ...data, price: Number(10) }}
    //   currentStep={currentStep}
    //   setCurrentStep={setCurrentStep}
    //   price={price}
    //   setPrice={setPrice}
    //   sendOfferHandler={sendOfferHandler}
    //   isLoading={sellItem.isLoading}
    //   // onSubmit={submitForm}
    //   isOfferAccepted={true}
    //   text={{
    //     sell: text.store.sellCharacter,
    //     success: text.store.characterSuccessfullyPlacedInShop,
    //     successLong: text.store.characterSuccessfullyPlacedInShop,
    //     check: text.store.viewInShop,
    //   }}
    // >
    //   <FadeInOut show>
    //     <ItemDetailSection item={data} />
    //   </FadeInOut>
    //   <ToastGoToWallet showToast={showToast} closeAndRedirect={closeAndRedirect} />
    // </Sell>
  );
};
