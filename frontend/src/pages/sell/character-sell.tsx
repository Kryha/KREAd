import { Navigate, useParams } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { CharacterDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useMyCharacter, useSellCharacter } from "../../service";
import { Sell } from "./sell";

export const CharacterSell = () => {
  const { id } = useParams<"id">();

  const [data, isLoading] = useMyCharacter(String(id));
  const sellCharacter = useSellCharacter();

  const submitForm = (price: number) => {
    if (!id) return;
    // TODO: show progress
    sellCharacter.mutate({ characterId: id, price });
  };

  if (sellCharacter.isError) return <ErrorView />;

  if (sellCharacter.isSuccess) return <Navigate to={routes.shop} />;

  if (isLoading) return <LoadingPage />;

  if (!data) return <ErrorView />;

  return (
    <Sell
      onSubmit={submitForm}
      text={{ sell: text.store.sellCharacter }}
      data={{ ...data, image: data.items, category: data.type, id: data.id }}
    >
      <FadeInOut show>
        <CharacterDetailSection character={data} />
      </FadeInOut>
    </Sell>
  );
};
