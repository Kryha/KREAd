import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage, NotificationDetail, Overlay } from "../../components";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { CharacterDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useMyCharacter, useSellCharacter } from "../../service";
import { Sell } from "./sell";

export const CharacterSell = () => {
  const { id } = useParams<"id">();

  const idString = String(id);
  const [showToast, setShowToast] = useState(false);
  const [data, isLoading] = useMyCharacter(idString);
  const sellCharacter = useSellCharacter(idString);

  const submitForm = (price: number) => {
    sellCharacter.callback(price);
  };

  if (sellCharacter.isError) return <ErrorView />;

  if (sellCharacter.isSuccess) return <Navigate to={routes.shop} />;

  if (isLoading) return <LoadingPage spinner={false} />;

  if (!data) return <ErrorView />;

  const { nft, equippedItems } = data;

  const displayToast = () => {
    setShowToast(true);
  };

  return (
    <Sell
      isLoading={sellCharacter.isLoading}
      onSubmit={submitForm}
      text={{ sell: text.store.sellCharacter }}
      data={{ ...nft, image: equippedItems, category: nft.type, characterImage: nft.image }}
    >
      <FadeInOut show>
        <CharacterDetailSection character={data} equippedItems={equippedItems} showToast={displayToast} />
      </FadeInOut>
    </Sell>
  );
};
