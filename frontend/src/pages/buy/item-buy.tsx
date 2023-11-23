import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { ItemInMarket } from "../../interfaces";
import { useBuyItem } from "../../service";
import { Buy } from "./buy";
import { useItemMarketState } from "../../context/item-shop-context";
import { ErrorView } from "../../components";
import { handleOfferResultBuilder } from "../../util/contract-callbacks";

export const ItemBuy = () => {
  const { id } = useParams<"id">();

  const { items } = useItemMarketState();
  const itemToBuy = items.find((marketEntry) => marketEntry.id === id);
  const buyItem = useBuyItem(itemToBuy);

  const [isAwaitingApproval, setIsAwaitingApproval] = useState(false);
  const [isOfferAccepted, setIsOfferAccepted] = useState(false);
  const [data, setData] = useState<ItemInMarket>();

  useEffect(() => {
    // without this, the view will error out after purchase, since the item won't be on the market anymore
    if (itemToBuy) setData(itemToBuy);
  }, [itemToBuy, buyItem]);

  useEffect(() => {
    if (itemToBuy) setIsAwaitingApproval(false);
  }, [itemToBuy]);

  const handleSubmit = async () => {
    setIsAwaitingApproval(true);
    await buyItem.callback(() => {
      setIsOfferAccepted(true);
      setIsAwaitingApproval(false);
    }, handleOfferResultBuilder());
  };

  if (!data) return <ErrorView />;

  const { royalty, platformFee, price } = data.sell;

  const totalPrice = Number(royalty + platformFee + price);

  return (
    <Buy
      data={data && { ...data.item, price: totalPrice, type: "item" }}
      onSubmit={handleSubmit}
      isLoading={isAwaitingApproval}
      isOfferAccepted={isOfferAccepted}
      text={{
        buy: text.store.buyItem,
        success: text.store.itemSuccessfullyBought,
        successLong: text.store.yourNewItemIs,
        check: text.store.checkItem,
      }}
    />
  );
};
