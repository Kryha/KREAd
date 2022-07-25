import { useParams } from "react-router-dom";
import { text } from "../../assets";

import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useCharacterFromMarket } from "../../service";
import { Buy } from "./buy";

export const CharacterBuy = () => {
  const { id } = useParams<"id">();
  const [data, isLoading] = useCharacterFromMarket(String(id));

  if (isLoading) return <LoadingPage />;

  if (!data) return <ErrorView />;

  return (
    <Buy
      data={data.character}
      text={{
        buy: text.store.buyCharacter,
        success: text.store.characterSuccessfullyBought,
        successLong: text.store.yourNewCharacterIs,
        check: text.store.checkCharacter,
      }}
    >
      <FadeInOut show>
        <CharacterDetailSection character={data.character} />
      </FadeInOut>
    </Buy>
  );
};
