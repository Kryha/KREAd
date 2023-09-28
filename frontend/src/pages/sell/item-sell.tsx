import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView } from "../../components";
import { useSellItem } from "../../service";
import { Sell } from "./sell";
import { SellData } from "./types";
import { isItemCategory, Category } from "../../interfaces";
import { useWalletState } from "../../context/wallet";

export const ItemSell = () => {
  const { name, category } = useParams<"category" | "name">();
  const { itemProposals } = useWalletState();

  // @ts-ignore
  const latestItemSellProposal = useMemo(()=> itemProposals[itemProposals.length-1].give.Item.value.payload[0][0], [itemProposals]);
  const isPlacedInShop = useMemo(() => latestItemSellProposal.name === name && latestItemSellProposal.category === category, [latestItemSellProposal, name, category]);
  
  const sellItem = useSellItem(name, category as Category);
  const [data, setData] = useState<SellData>({ price: 0 });

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
