import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { text } from "../../assets";

import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useCharacterContext } from "../../context/characters";
import { CharacterInMarket } from "../../interfaces";
import { useBuyCharacter, useCharacterFromMarket, useMyCharacter } from "../../service";
import { getExtendedCharacter } from "../../service/util";
import { Buy } from "./buy";

export const CharacterBuy = () => {
  const { id } = useParams<"id">();
  const idString = String(id);

  const [{ owned }] = useCharacterContext();
  const [characterInMarket, isLoadingCharacter] = useCharacterFromMarket(idString);
  const [boughtCharacter] = useMyCharacter(idString);
  const buyCharacter = useBuyCharacter(idString);

  const [isAwaitingApproval, setIsAwaitingApproval] = useState(false);
  const [data, setData] = useState<CharacterInMarket>();

  useEffect(() => {
    // without this, the view will error out after purchase, since the character won't be on the market anymore
    if (characterInMarket) setData(characterInMarket);
  }, [characterInMarket]);

  useEffect(() => {
    // TODO: handle declining character and error
    if (boughtCharacter || !buyCharacter.isLoading) setIsAwaitingApproval(false);
  }, [boughtCharacter, buyCharacter.isLoading]);

  // TODO: handle offer denied and error
  const handleSubmit = () => {
    if (!id) return;
    setIsAwaitingApproval(true);
    buyCharacter.callback();
  };

  if (isLoadingCharacter) return <LoadingPage />;

  if (!data) return <ErrorView />;

  return (
    <Buy
      data={{ ...data.character, price: Number(data.sell.price) }}
      onSubmit={handleSubmit}
      isLoading={isAwaitingApproval}
      isOfferAccepted={!!boughtCharacter}
      text={{
        buy: text.store.buyCharacter,
        success: text.store.characterSuccessfullyBought,
        successLong: text.store.yourNewCharacterIs,
        check: text.store.checkCharacter,
      }}
    >
      <FadeInOut show>
        <CharacterDetailSection character={getExtendedCharacter(data.character.name, owned)} equippedItems={data.equippedItems} />
      </FadeInOut>
    </Buy>
  );
};
