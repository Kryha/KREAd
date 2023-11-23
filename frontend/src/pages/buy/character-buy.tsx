import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";

import { ErrorView, LoadingPage } from "../../components";
import { CharacterInMarket } from "../../interfaces";
import { useBuyCharacter, useCharacterFromMarket, useMyCharacter } from "../../service";
import { Buy } from "./buy";
import { handleOfferResultBuilder } from "../../util/contract-callbacks";

export const CharacterBuy = () => {
  const { id } = useParams<"id">();
  const idString = String(id);

  const [characterInMarket, isLoadingCharacter] = useCharacterFromMarket(idString);
  const [boughtCharacter] = useMyCharacter(Number(idString));
  const buyCharacter = useBuyCharacter(idString);

  const [isAwaitingApproval, setIsAwaitingApproval] = useState(false);
  const [data, setData] = useState<CharacterInMarket>();

  useEffect(() => {
    // without this, the view will error out after purchase, since the character won't be on the market anymore
    if (characterInMarket) setData(characterInMarket);
  }, [characterInMarket]);

  useEffect(() => {
    // TODO: handle declining character and error
    if (boughtCharacter) setIsAwaitingApproval(false);
  }, [boughtCharacter]);

  // TODO: handle offer denied and error
  const handleSubmit = async () => {
    if (!id) return;
    setIsAwaitingApproval(true);
    await buyCharacter.callback(handleOfferResultBuilder());
  };

  if (isLoadingCharacter) return <LoadingPage spinner={false} />;

  if (!data) return <ErrorView />;

  const { royalty, platformFee, price } = data.sell;

  const totalPrice = Number(royalty + platformFee + price);

  return (
    <Buy
      data={{ ...data.character, price: totalPrice, type: "character" }}
      onSubmit={handleSubmit}
      isLoading={isAwaitingApproval}
      isOfferAccepted={!!boughtCharacter}
      text={{
        buy: text.store.buyCharacter,
        success: text.store.characterSuccessfullyBought,
        successLong: text.store.yourNewCharacterIs,
        check: text.store.checkCharacter,
      }}
    />
  );
};

//TODO: Might add this back as a more info
// <FadeInOut show>
//   <CharacterDetailSection character={{ nft: data.character, equippedItems: data.equippedItems }} showToast={displayToast} />
// </FadeInOut>
// <FadeInOut show={showToast} exiting={!showToast}>
//   {showToast && <Overlay isOnTop={true} />}
//   <NotificationWrapper showNotification={showToast}>
//     <NotificationDetail
//       title={text.general.goToYourWallet}
//       info={text.general.yourActionIsPending}
//       closeToast={() => setShowToast(false)}
//       isError
//     />
//   </NotificationWrapper>
// </FadeInOut>
