import React, { FC, useEffect, useState } from "react";
import { text } from "../../assets";
import { OverviewEmpty } from "../../components";
import { routes } from "../../navigation";
import { useMyCharacter, useMyCharacters } from "../../service";
import { AssetFilters } from "../../components/asset-filters/asset-filters";
import { ASSET_TYPE, SECTION } from "../../constants";
import { OverviewContainer } from "../shop/styles";
import { CharacterDetailsInventory } from "../../components/asset-details/character-details-inventory";
import { CharacterCardsInventory } from "../../components/asset-cards/character-cards-inventory";

interface Props {
  pageSelector: React.ReactNode;
}

export const CharactersInventory: FC<Props> = ({ pageSelector }) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSorting, setSelectedSorting] = useState<string>("");

  // FIXME: Leaving commented code for implementation of filter logic
  // const userStateDispatch = useUserStateDispatch();
  const [characters, isLoadingCharacters] = useMyCharacters();
  const [character] = useMyCharacter(selectedId);
  // const [noCharacters, setNoCharacters] = useState(false);
  // const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //   if (isLoadingCharacters || !!selectedId) return;
    //   if (characters.length) {
    //     setSelectedId(characters[0].nft.id);
    //   }
    setIsLoading(false);
    // }, [characters, isLoadingCharacters, selectedId]);
  }, [isLoadingCharacters]);

  // const select = () => {
  //   if (!character) return;
  //   const { isEquipped: _, ...rest } = character;
  //   userStateDispatch({ type: "SET_SELECTED", payload: rest });
  // };

  // const sell = () => {
  //   if (!selectedId) return;
  //   navigate(`${routes.sellCharacter}/${selectedId}`);
  // };

  // if (isLoadingCharacters || isLoading) return <LoadingPage />;
  // if (!character) return <ErrorView />;

  // const detailActions = () => {
  //   if (character.isEquipped || character.isForSale) {
  //     return {
  //       secondary: { text: text.character.sell, onClick: sell },
  //     };
  //   } else {
  //     return {
  //       primary: { text: text.character.select, onClick: select },
  //       secondary: { text: text.character.sell, onClick: sell },
  //     };
  //   }
  // };

  // const onFilterChange = (items: boolean) => {
  //   setNoCharacters(items);
  // };

  // const displayToast = () => {
  //   setShowToast(true);
  // };

  return (
    <>
      <AssetFilters
        assetType={ASSET_TYPE.CHARACTER}
        section={SECTION.INVENTORY}
        pageSelector={pageSelector}
        assets={characters}
        selectedCategories={selectedCategories}
        selectedSorting={selectedSorting}
        setSelectedSorting={setSelectedSorting}
        setSelectedCategories={setSelectedCategories}
      />
      {selectedId && <CharacterDetailsInventory character={character} />}
      {characters.length > 0 ? (
        <CharacterCardsInventory characters={characters} isLoading={isLoading} selectCharacter={(id: string) => setSelectedId(id)} />
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
