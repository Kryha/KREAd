import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView, FadeInOut } from "../../components";
import { SELL_ITEM_DESCRIPTION } from "../../constants";
import { ItemDetailSection } from "../../containers/detail-section";
import { useMyItem, useOffers, useSellItem } from "../../service";
import { Sell } from "./sell";
import { SellData } from "./types";

export const ItemSell = () => {
  const { id } = useParams<"id">();
  const idString = String(id);

  const sellItem = useSellItem(idString);
  const [item] = useMyItem(idString);
  const [itemCopy] = useState(item);
  const offers = useOffers({ description: SELL_ITEM_DESCRIPTION, status: "pending" });
  const [isPlacedInShop, setIsPlacedInShop] = useState(false);
  const [data, setData] = useState<SellData>({ price: 0 });

  useEffect(() => {
    if (offers.filter((offer) => offer.proposalTemplate.give.Item.value[0].id === Number(idString)).length > 0) {
      setIsPlacedInShop(true);
    }
  }, [idString, offers]);

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
