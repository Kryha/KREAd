import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";
import { ErrorView, FadeInOut } from "../../components";
import { SELL_CHARACTER_DESCRIPTION } from "../../constants";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useMyCharacter, useOffers, useSellCharacter } from "../../service";
import { Sell } from "./sell";
import { SellData } from "./types";

export const CharacterSell = () => {
  const { id } = useParams<"id">();
  const idString = String(id);

  const sellCharacter = useSellCharacter(idString);
  const [character] = useMyCharacter(idString);
  const [characterCopy] = useState(character);
  const offers = useOffers({ description: SELL_CHARACTER_DESCRIPTION, status: "pending" });
  const [isPlacedInShop, setIsPlacedInShop] = useState(false);
  const [data, setData] = useState<SellData>({ price: 0 });

  useEffect(() => {
    if (
      offers.filter(
        (offer) => offer.proposalTemplate.give.Character && offer.proposalTemplate.give.Character.value[0].id === Number(idString)
      ).length > 0
    ) {
      setIsPlacedInShop(true);
    }
  }, [idString, offers]);

  const sendOfferHandler = useCallback(
    async (data: SellData) => {
      if (data.price < 1) return; // We don't want to sell for free in case someone managed to fool the frontend
      await sellCharacter.callback(data.price);
    },
    [sellCharacter]
  );

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
    >
      <FadeInOut show>
        <CharacterDetailSection character={characterCopy} showToast={() => ({})} />
      </FadeInOut>
    </Sell>
  );
};
