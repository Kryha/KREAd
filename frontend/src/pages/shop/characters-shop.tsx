import { FC, ReactNode, useState } from "react";
import { SECTION } from "../../constants";
import { useGetCharacterInShopById, useGetCharactersInShop } from "../../service";
import { routes } from "../../navigation";
import { OverviewContainer } from "./styles";
import { OverviewEmpty } from "../../components";
import { text } from "../../assets";
import { CharacterDetailsMarket } from "../../components/asset-details/character-details-market";
import { CharacterCardsMarket } from "../../components/asset-cards/character-cards-market";
import { AssetCharacterFilters } from "../../components/asset-character-filters/asset-character-filters";

interface Props {
  pageSelector?: ReactNode;
}

export const CharactersShop: FC<Props> = ({ pageSelector }) => {
  const [selectedId, setSelectedId] = useState<string>("");

  const [characters, isLoading] = useGetCharactersInShop();

  const [character] = useGetCharacterInShopById(selectedId);

  return (
    <>
      <AssetCharacterFilters section={SECTION.SHOP} pageSelector={pageSelector} />
      {selectedId && <CharacterDetailsMarket characterInMarket={character} selectCharacter={(id: string) => setSelectedId(id)} />}
      {characters.length > 0 ? (
        <CharacterCardsMarket charactersInMarket={characters} isLoading={isLoading} selectCharacterId={(id: string) => setSelectedId(id)} />
      ) : (
        <OverviewContainer>
          <OverviewEmpty
            headingText={text.store.thereAreNoCharactersInTheShop}
            descriptionText={text.store.thereAreNoCharactersAvailable}
            buttonText={text.navigation.goHome}
            redirectRoute={routes.character}
            secondary
          />
        </OverviewContainer>
      )}
    </>
  );
};
