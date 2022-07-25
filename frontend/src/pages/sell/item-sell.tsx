import { Navigate, useParams } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { ItemDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useItem, useSellItem } from "../../service";
import { Sell } from "./sell";

export const ItemSell = () => {
  const { id } = useParams<"id">();

  const { data, isLoading, isError } = useItem(String(id));
  const sellItem = useSellItem();

  const submitForm = (price: number) => {
    // sellItem.mutate({ price });
  };

  if (sellItem.isError) return <ErrorView />;

  if (sellItem.isSuccess) return <Navigate to={routes.shop} />;

  if (isLoading) return <LoadingPage />;

  if (!data || isError) return <ErrorView />;

  return (
    <Sell onSubmit={submitForm} text={{ sell: text.store.sellItem }} data={{ ...data, image: data.thumbnail }}>
      <FadeInOut show>
        <ItemDetailSection item={data} />
      </FadeInOut>
    </Sell>
  );
};
