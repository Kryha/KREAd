import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { FadeInOut } from "../../components";
import { ItemDetailSection } from "../../containers/detail-section";
import { ItemInMarket } from "../../interfaces";
import { useBuyItem } from "../../service";
import { Buy } from "./buy";
import { useItemMarketState } from "../../context/item-shop-context";

export const ItemBuy = () => {
  const { id } = useParams<"id">();
  const { items } = useItemMarketState();
  const itemToBuy = items.find((marketEntry) => marketEntry.id === id);
  const buyItem = useBuyItem(itemToBuy!);

  const [isAwaitingApproval, setIsAwaitingApproval] = useState(true);
  const [data, setData] = useState<ItemInMarket>();

  useEffect(() => {
    // without this, the view will error out after purchase, since the item won't be on the market anymore
    if (itemToBuy) setData(itemToBuy);
  }, [itemToBuy, buyItem]);

  const handleSubmit = async () => {
    setIsAwaitingApproval(true);
    await buyItem.callback(() => setIsAwaitingApproval(false));
  };

  return (
    <Buy
      data={data && { ...data.item, price: Number(data.sell.price) }}
      onSubmit={handleSubmit}
      isLoading={isAwaitingApproval}
      isOfferAccepted={isAwaitingApproval}
      text={{
        buy: text.store.buyItem,
        success: text.store.itemSuccessfullyBought,
        successLong: text.store.yourNewItemIs,
        check: text.store.checkItem,
      }}
    >
      <FadeInOut show>
        <ItemDetailSection item={data && data.item} />
      </FadeInOut>
    </Buy>
  );
};
