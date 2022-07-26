import { useParams } from "react-router-dom";
import { text } from "../../assets";

import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useBuyCharacter, useCharacterFromMarket, useMyCharacter } from "../../service";
import { Buy } from "./buy";

export const CharacterBuy = () => {
  const { id } = useParams<"id">();

  const [data, isLoading] = useCharacterFromMarket(String(id));
  const [boughtCharacter] = useMyCharacter(String(id));

  const buyCharacter = useBuyCharacter();

  // TODO: handle offer denied and error
  const handleSubmit = () => {
    if (!id) return;
    buyCharacter.mutate({ characterId: id });
  };

  if (isLoading) return <LoadingPage />;

  if (!data) return <ErrorView />;

  return (
    <Buy
      data={{ ...data.character, price: Number(data.sell.price) }}
      onSubmit={handleSubmit}
      isLoading={buyCharacter.isLoading}
      isOfferAccepted={!!boughtCharacter}
      text={{
        buy: text.store.buyCharacter,
        success: text.store.characterSuccessfullyBought,
        successLong: text.store.yourNewCharacterIs,
        check: text.store.checkCharacter,
      }}
    >
      <FadeInOut show>
        <CharacterDetailSection character={data.character} />
      </FadeInOut>
    </Buy>
  );
};
