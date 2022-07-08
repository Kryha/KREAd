import { useParams } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { ItemDetailSection } from "../../containers/detail-section";
import { useItem } from "../../service";
import { Buy } from "./buy";

export const ItemBuy = () => {
  const { id } = useParams<"id">();
  const { data, isLoading, isError } = useItem(String(id));

  if (isLoading) return <LoadingPage />;

  if (!data || isError) return <ErrorView />;

  return (
    <Buy
      data={data}
      text={{
        buy: text.store.buyItem,
        success: text.store.itemSuccessfullyBought,
        successLong: text.store.yourNewItemIs,
        check: text.store.checkItem,
      }}
    >
      <FadeInOut show exiting={false}>
        <ItemDetailSection item={data} />
      </FadeInOut>
    </Buy>
  );
};
