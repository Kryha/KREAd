import { Navigate, useParams } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { CharacterDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useMyCharacter, useSellCharacter } from "../../service";
import { Sell } from "./sell";

export const CharacterSell = () => {
  const { id } = useParams<"id">();

  const idString = String(id);

  const [data, isLoading] = useMyCharacter(idString);
  const sellCharacter = useSellCharacter(idString);

  const submitForm = (price: number) => {
    sellCharacter.callback(price);
  };

  if (sellCharacter.isError) return <ErrorView />;

  if (sellCharacter.isSuccess) return <Navigate to={routes.shop} />;

  if (isLoading) return <LoadingPage />;

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
        <CharacterDetailSection character={data} equippedItems={equippedItems} />
      </FadeInOut>
    </Sell>
  );
};
