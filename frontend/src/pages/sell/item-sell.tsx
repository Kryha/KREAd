import { useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView, FadeInOut } from "../../components";
import { ItemDetailSection } from "../../containers/detail-section";
import { useSellItem } from "../../service";
import { Sell } from "./sell";
import { SellData } from "./types";
import { ItemCategory, isItemCategory } from "../../interfaces";
import { useWalletState } from "../../context/wallet";

export const ItemSell = () => {
  const { name, category } = useParams<"category" | "name">();

  if(!isItemCategory(category)) {
    return;
  }

  const { item: walletItems } = useWalletState();
  const itemToSell = walletItems.find((item) => (item.name===name && item.category === category));
  const sellItem = useSellItem(name, category as ItemCategory);
  const [isPlacedInShop, setIsPlacedInShop] = useState(false);
  const [data, setData] = useState<SellData>({ price: 0 });

  const sendOfferHandler = async (data: SellData) => {
    if (data.price < 1) return; // We don't want to sell for free in case someone managed to fool the frontend
    await sellItem.callback(data.price, () => setIsPlacedInShop(true));
  };

  if (!data) return <ErrorView />;

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
        <ItemDetailSection item={itemToSell} />
      </FadeInOut>
    </Sell>
  );
};
