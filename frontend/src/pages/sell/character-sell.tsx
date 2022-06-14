import { Navigate, useParams } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, LoadingPage } from "../../components";
import { CharacterDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useCharacter, useSellItem } from "../../service";
import { Sell } from "./sell";

export const CharacterSell = () => {
  const { id } = useParams<"id">();

  const { data, isLoading, isError } = useCharacter(String(id));
  const sellItem = useSellItem();

  const submitForm = (price: number) => {
    sellItem.mutate({ price });
  };

  if (sellItem.isError) return <ErrorView />;

  if (sellItem.isSuccess) return <Navigate to={routes.shop} />;

  if (isLoading) return <LoadingPage />;

  if (!data || isError) return <ErrorView />;

  return (
    <Sell onSubmit={submitForm} text={{ sell: text.store.sellCharacter }}>
      <CharacterDetailSection character={data} />
    </Sell>
  );
};
