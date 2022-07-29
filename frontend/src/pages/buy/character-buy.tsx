import { useParams } from "react-router-dom";
import { text } from "../../assets";

import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useCharacter } from "../../service";
import { Buy } from "./buy";

export const CharacterBuy = () => {
  const { id } = useParams<"id">();
  const { data, isLoading, isError } = useCharacter(String(id));

  if (isLoading) return <LoadingPage />;

  if (!data || isError) return <ErrorView />;

  return (
    <Buy
      data={{ price: 4 }}//data}
      text={{
        buy: text.store.buyCharacter,
        success: text.store.characterSuccessfullyBought,
        successLong: text.store.yourNewCharacterIs,
        check: text.store.checkCharacter,
      }}
    >
      <FadeInOut show exiting={false}>
        <CharacterDetailSection character={data} />
      </FadeInOut>
    </Buy>
  );
};
