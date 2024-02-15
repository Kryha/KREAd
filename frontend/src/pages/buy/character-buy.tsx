import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";

import { ErrorView, LoadingPage } from "../../components";
import { CharacterInMarket } from "../../interfaces";
import { useBuyCharacter, useCharacterFromMarket, useMyCharacter } from "../../service";
import { Buy } from "./buy";

export const CharacterBuy = () => {
  const { id } = useParams<"id">();
  const idString = String(id);

  const [characterInMarket, isLoadingCharacter] = useCharacterFromMarket(idString);
  const [boughtCharacter] = useMyCharacter(Number(idString));
  const buyCharacter = useBuyCharacter(idString);

  const [isAwaitingApproval, setIsAwaitingApproval] = useState(false);
  const [data, setData] = useState<CharacterInMarket>();

  useEffect(() => {
    // without this, the view will error out after purchase, since the character won't be on the market anymore
    if (characterInMarket) setData(characterInMarket);
  }, [characterInMarket]);

  useEffect(() => {
    if (boughtCharacter) setIsAwaitingApproval(false);
  }, [boughtCharacter]);

  const handleSubmit = async () => {
    if (!id) return;
    setIsAwaitingApproval(true);
    await buyCharacter.sendOffer({});
  };

  if (isLoadingCharacter) return <LoadingPage spinner={false} />;

  if (!data) return <ErrorView />;

  const { royalty, platformFee, price } = data.sell;

  const totalPrice = Number(royalty + platformFee + price);

  return (
    <Buy
      data={{ ...data.character, price: totalPrice, type: "character" }}
      onSubmit={handleSubmit}
      isLoading={isAwaitingApproval}
      isOfferAccepted={!!boughtCharacter}
      text={{
        buy: text.store.buyCharacter,
        success: text.store.characterSuccessfullyBought,
        successLong: text.store.yourNewCharacterIs,
        check: text.store.checkCharacter,
      }}
    />
  );
};
