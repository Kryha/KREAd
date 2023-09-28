import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView } from "../../components";
import { useSellItem } from "../../service";
import { Sell } from "./sell";
import { SellData } from "./types";
import { isItemCategory, Category } from "../../interfaces";
import { useWalletState } from "../../context/wallet";
import { useItemMarketState } from "../../context/item-shop-context";
import { item } from "../../assets/text/item";

export const ItemSell = () => {
  const { name, category } = useParams<"category" | "name">();

  const { item: walletItems } = useWalletState();
  const { items: itemsInMarket } = useItemMarketState();
  
  // Locking itemToSell in useMemo to prevent it from updating when it leaves the wallet
  // const itemToSell = useMemo(() => walletItems.find((item) => item.name === name && item.category === category), []);
  // const itemSold = useMemo(() => !!(itemsInMarket.find(({item}) => item.category === category && item.name === name)), [name, category, itemsInMarket]);
  const isPlacedInShop = useMemo(() => !!(itemsInMarket.find(({item}) => item.category === category && item.name === name)), [name, category, itemsInMarket]);

  const sellItem = useSellItem(name, category as Category);
  // const [isPlacedInShop, setIsPlacedInShop] = useState(false);
  const [data, setData] = useState<SellData>({ price: 0 });

  console.log(isPlacedInShop)
  const sendOfferHandler = async (data: SellData) => {
    if (data.price < 1) return; // We don't want to sell for free in case someone managed to fool the frontend
    await sellItem.callback(data.price, () => console.info("call settled"));
  };

  if (!data || !isItemCategory(category)) return <ErrorView />;

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
