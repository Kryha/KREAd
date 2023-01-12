import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage, Data } from "../../components";
import { WALLET_INTERACTION_STEP } from "../../constants";
import { ToastGoToWallet } from "../../components/toast-go-to-wallet";
import { CharacterDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useCharacterFromMarket, useMyCharacter, useMyCharacters, useSellCharacter } from "../../service";
import { Sell } from "./sell";
import { SellData, SellStep } from "./types";
import { CharacterInMarket } from "../../interfaces";

export const CharacterSell = () => {
  const { id } = useParams<"id">();
  const [showToast, setShowToast] = useState(false);
  const idString = String(id);

  const [isError, setIsError] = useState(false);
  // const [characterInMarket, isLoadingCharacter] = useCharacterFromMarket(idString);

  const sellCharacter = useSellCharacter(idString);
  const [character] = useMyCharacter(idString);
  const [data, setData] = useState<SellData>({
    id: idString,
    object: "character",
    price: 0,
  });

  const [isAwaitingApproval, setIsAwaitingApproval] = useState(false);

  // useEffect(() => {
  //   // without this, the view will error out after placing in store, since the character won't be in the wallet anymore
  //   if (myCharacter) setData(myCharacter);
  // }, [sellCharacter]);

  useEffect(() => {
    // TODO: handle declining character and error
    if (!sellCharacter || !sellCharacter.isLoading) setIsAwaitingApproval(false);
  }, [sellCharacter, sellCharacter.isLoading]);

  // TODO: handle offer denied and error
  const sendOfferHandler = async (data: SellData) => {
    console.log("sendOfferHandler", data.price);
    setIsAwaitingApproval(true);
    await sellCharacter.callback(data.price);
  };

  const displayToast = () => {
    setShowToast(true);
  };

  if (isError) return <ErrorView />;

  if (sellCharacter.isLoading) return <LoadingPage spinner={false} />;

  if (!data) return <ErrorView />;

  return (
    <Sell
      data={data}
      setData={setData}
      // currentStep={currentStep}
      // setCurrentStep={setCurrentStep}
      // price={price}
      // setPrice={setPrice}
      sendOfferHandler={sendOfferHandler}
      isLoading={sellCharacter.isLoading}
      // onSubmit={submitForm}
      isOfferAccepted={isAwaitingApproval}
      text={{
        sell: text.store.sellCharacter,
        success: text.store.characterPlacedInShop,
        successLong: text.store.characterSuccessfullyPlacedInShop,
        check: text.store.viewInShop,
      }}
    >
      <FadeInOut show>
        <CharacterDetailSection character={character} showToast={displayToast} />
      </FadeInOut>
    </Sell>
  );
};
