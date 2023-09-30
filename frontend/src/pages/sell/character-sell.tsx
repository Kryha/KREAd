import { useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView } from "../../components";
import { useMyCharacter, useSellCharacter } from "../../service";
import { Sell } from "./sell";
import { SellData } from "./types";

export const CharacterSell = () => {
  const { id } = useParams<"id">();
  const idString = String(id);

  const sellCharacter = useSellCharacter(Number(idString));
  const [character] = useMyCharacter(Number(idString));
  const [characterCopy] = useState(character);

  const [isPlacedInShop, setIsPlacedInShop] = useState(false);
  const [data, setData] = useState<SellData>({ price: 0 });

  const sendOfferHandler = async (data: SellData) => {
    if (data.price < 1) return; // We don't want to sell for free in case someone managed to fool the frontend
    await sellCharacter.callback(data.price, () => setIsPlacedInShop(true));
  };

  if (!data || !characterCopy) return <ErrorView />;

  return (
    <Sell
      data={data}
      setData={setData}
      sendOfferHandler={sendOfferHandler}
      isPlacedInShop={isPlacedInShop}
      text={{
        sell: text.store.sellCharacter,
        success: text.store.characterPlacedInShop,
        successLong: text.store.characterSuccessfullyPlacedInShop,
        check: text.store.goToInventory,
      }}
    />
  );
};
