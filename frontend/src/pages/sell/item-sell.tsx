import { Navigate, useParams } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { ItemDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useMyItem, useSellItem } from "../../service";
import { Sell } from "./sell";

export const ItemSell = () => {
  const { id } = useParams<"id">();

  const idString = String(id);

  const [data, isLoading] = useMyItem(idString);
  const sellItem = useSellItem(idString);

  const submitForm = (price: number) => {
    sellItem.callback(price);
  };

  if (sellItem.isError) return <ErrorView />;

  if (sellItem.isSuccess) return <Navigate to={routes.shop} />;

  if (isLoading) return <LoadingPage />;

  if (!data) return <ErrorView />;

  return (
    <Sell
      isLoading={sellItem.isLoading}
      onSubmit={submitForm}
      text={{ sell: text.store.sellItem }}
      data={{ ...data, image: data.thumbnail }}
    >
      <FadeInOut show>
        <ItemDetailSection item={data} />
      </FadeInOut>
    </Sell>
  );
};
