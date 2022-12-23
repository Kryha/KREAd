import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { ToastGoToWallet } from "../../components/toast-go-to-wallet";
import { CharacterDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useMyCharacter, useSellCharacter } from "../../service";
import { Sell } from "./sell";

export const CharacterSell = () => {
  const { id } = useParams<"id">();
  const navigate = useNavigate();

  const idString = String(id);
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, isLoading] = useMyCharacter(idString);
  const sellCharacter = useSellCharacter(idString);

  const submitForm = async (price: number) => {
    const res = await sellCharacter.callback(price);
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

  // TODO: this prevents the page from trying to load a character that is no longer available
  // we'll be refactoring this to listen for the offer accepted action
  if (!data) closeAndRedirect();

  if (!data) return <ErrorView />;
  
  const { nft, equippedItems } = data;  

  return (
    <Sell
      isLoading={sellCharacter.isLoading}
      onSubmit={submitForm}
      text={{ sell: text.store.sellCharacter }}
      data={{ ...nft, image: equippedItems, category: nft.type, characterImage: nft.image }}
    >
      <FadeInOut show>
        <CharacterDetailSection character={data} showToast={displayToast} />
      </FadeInOut>
      <ToastGoToWallet showToast={showToast} closeAndRedirect={closeAndRedirect} />
    </Sell>
  );
};
