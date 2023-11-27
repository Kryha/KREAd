import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView } from "../../components";
import { useMyCharacter, useSellCharacter } from "../../service";
import { Sell } from "./sell";
import { SellData } from "./types";
// import { handleOfferResultBuilder } from "../../util/contract-callbacks";
import { AddOfferCallback } from "../../interfaces";
import { useUserStateDispatch } from "../../context/user";

export const CharacterSell = () => {
  const { id } = useParams<"id">();
  const idString = String(id);
  const userDispatch = useUserStateDispatch();

  const sellCharacter = useSellCharacter(Number(idString));
  const [character] = useMyCharacter(Number(idString));
  const [characterCopy] = useState(character);

  const [isPlacedInShop, setIsPlacedInShop] = useState(false);
  const [data, setData] = useState<SellData>({ price: 0 });

  const handleResult: AddOfferCallback = {
    settled: () => {
      // Currently calling this logic on settled due to an issue with the status returned by the sell method,
      // TODO: move this logic to a more specific callback
      setIsPlacedInShop(true),
      userDispatch({ type: "SET_SELECTED", payload: "" });
    },
  };

  const sendOfferHandler = async (data: SellData) => {
    await sellCharacter.sendOffer(data.price, handleResult);
  };

  const characterName = useMemo(() => character?.nft.name, [character]);
  data.type = "character";
  data.name = characterName;

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
