import { useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView } from "../../components";
import { useSellItem } from "../../service";
import { Sell } from "./sell";
import { SellData } from "./types";
import { Category, isItemCategory } from "../../interfaces";

export const ItemSell = () => {
  const { name, category } = useParams<"category" | "name">();
  const [isPlacedInShop, setIsPlacedInShop] = useState(false);
  const sellItem = useSellItem(name, category as Category);
  const [data, setData] = useState<SellData>({ price: 0 });

  const sendOfferHandler = async (data: SellData) => {
    if (data.price < 1) return; // We don't want to sell for free in case someone managed to fool the frontend
    await sellItem.sendOffer(data.price, () => setIsPlacedInShop(true), {});
  };

  if (!data || !isItemCategory(category)) return <ErrorView />;
  data.type = "item";
  data.name = name;

  return (
    <Sell
      data={data}
      setData={setData}
      sendOfferHandler={sendOfferHandler}
      isPlacedInShop={isPlacedInShop}
      text={{
        sell: text.store.sellItem,
        success: text.store.itemPlacedInShop,
        successLong: text.store.itemSuccessfullyPlacedInShop,
        check: text.store.goToInventory,
      }}
    />
  );
};
