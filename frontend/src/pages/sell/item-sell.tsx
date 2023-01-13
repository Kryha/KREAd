import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView, FadeInOut } from "../../components";
// import { ToastGoToWallet } from "../../components/toast-go-to-wallet";
import { ItemDetailSection } from "../../containers/detail-section";
import { useMyItem, useSellItem } from "../../service";
import { Sell } from "./sell";
import { SellData } from "./types";

export const ItemSell = () => {
  const { id } = useParams<"id">();
  // const [showToast, setShowToast] = useState(false);
  const idString = String(id);

  const sellItem = useSellItem(idString);
  const [item] = useMyItem(idString);
  const [isPlacedInShop, setIsPlacedInShop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SellData>({ price: 0 });
  const [itemCopy] = useState(item);

  useEffect(() => {
    if (!item) setIsPlacedInShop(true);
  }, [item]);

  useEffect(() => {
    if (sellItem.isLoading) setIsLoading(true);
  }, [sellItem.isLoading]);

  const sendOfferHandler = async (data: SellData) => {
    if (data.price < 1) return;
    sellItem.callback(data.price);
  };

  if (!data || !itemCopy) return <ErrorView />;

  return (
    <Sell
      data={data}
      setData={setData}
      sendOfferHandler={sendOfferHandler}
      isLoading={isLoading}
      isPlacedInShop={isPlacedInShop}
      text={{
        sell: text.store.sellCharacter,
        success: text.store.characterPlacedInShop,
        successLong: text.store.characterSuccessfullyPlacedInShop,
        check: text.store.goToInventory,
      }}
    >
      <FadeInOut show>
        <ItemDetailSection item={itemCopy} />
      </FadeInOut>
    </Sell>
  );
};
