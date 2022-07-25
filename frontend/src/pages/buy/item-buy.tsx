import { useParams } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { ItemDetailSection } from "../../containers/detail-section";
import { useItemFromMarket } from "../../service";
import { Buy } from "./buy";

export const ItemBuy = () => {
  const { id } = useParams<"id">();
  const [data, isLoading] = useItemFromMarket(String(id));

  if (isLoading) return <LoadingPage />;

  if (!data) return <ErrorView />;

  return (
    <Buy
      data={data.item}
      text={{
        buy: text.store.buyItem,
        success: text.store.itemSuccessfullyBought,
        successLong: text.store.yourNewItemIs,
        check: text.store.checkItem,
      }}
    >
      <FadeInOut show>
        <ItemDetailSection item={data.item} />
      </FadeInOut>
    </Buy>
  );
};
