import { FC, ReactNode, useState } from "react";
import { ASSET_TYPE, MAX_PRICE, MIN_PRICE, SECTION } from "../../constants";
import { useGetCharacterInShopById, useGetCharactersInShop } from "../../service";
import { routes } from "../../navigation";
import { AssetFilters } from "../../components/asset-filters/asset-filters";
import { OverviewContainer } from "./styles";
import { OverviewEmpty } from "../../components";
import { text } from "../../assets";
import { CharacterDetailsMarket } from "../../components/asset-details/character-details-market";
import { CharacterCardsMarket } from "../../components/asset-cards/character-cards-market";

interface Props {
  pageSelector: ReactNode;
}

export const CharactersShop: FC<Props> = ({ pageSelector }) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number }>({ min: MIN_PRICE, max: MAX_PRICE });

  const [characters, isLoading] = useGetCharactersInShop({
    categories: selectedCategories,
    sort: selectedSorting,
    price: selectedPrice,
  });

  const [character] = useGetCharacterInShopById(selectedId);
  // if (!character) return <h1>No character found?!</h1>;

  return (
    <>
      <AssetFilters
        assetType={ASSET_TYPE.CHARACTER}
        section={SECTION.SHOP}
        pageSelector={pageSelector}
        assets={characters}
        selectedCategories={selectedCategories}
        selectedSorting={selectedSorting}
        selectedPrice={selectedPrice}
        setSelectedSorting={setSelectedSorting}
        setSelectedCategories={setSelectedCategories}
        setSelectedPrice={setSelectedPrice}
      />
      { selectedId && 
        <CharacterDetailsMarket
          characterInMarket={character}
          selectCharacter={(id: string) => setSelectedId(id)}
        />
      }
      {characters.length > 0 ? (
        <CharacterCardsMarket
          charactersInMarket={characters}
          isLoading={isLoading}
          selectCharacterId={(id: string)=>setSelectedId(id)}
        />
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
