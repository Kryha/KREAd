import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView, FadeInOut } from "../../components";
import { ItemDetailSection } from "../../containers/detail-section";
import { useMyItem, useSellItem } from "../../service";
import { Sell } from "./sell";
import { SellData } from "./types";

export const ItemSell = () => {
  const { id } = useParams<"id">();
  const idString = String(id);

  const sellItem = useSellItem(idString);
  const [item] = useMyItem(idString);
  const [isPlacedInShop, setIsPlacedInShop] = useState(false);
  const [data, setData] = useState<SellData>({ price: 0 });
  const [itemCopy] = useState(item);

  useEffect(() => {
    if (!item) setIsPlacedInShop(true);
  }, [item]);

  const sendOfferHandler = async (data: SellData) => {
    if (data.price < 1) return; // We don't want to sell for free in case someone managed to fool the frontend
    await sellItem.callback(data.price);
  };

  if (!data || !itemCopy) return <ErrorView />;

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
    >
      <FadeInOut show>
        <ItemDetailSection item={itemCopy} />
      </FadeInOut>
    </Sell>
  );
};
