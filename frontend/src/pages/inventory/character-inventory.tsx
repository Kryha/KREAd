import React, { FC, useEffect, useState } from "react";
import { text } from "../../assets";
import { HorizontalDivider, OverviewEmpty } from "../../components";
import { routes } from "../../navigation";
import { useMyCharacter, useMyCharacters } from "../../service";
import { OverviewContainer } from "../shop/styles";
import { CharacterDetailsInventory } from "../../components/asset-details/character-details-inventory";
import { CharacterCardsInventory } from "../../components/asset-cards/character-cards-inventory";
import { AssetFilterCount } from "../../components/asset-item-filters/styles";
import { color } from "../../design";

interface Props {
  pageSelector?: React.ReactNode;
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

  const assetsCount = characters.length;

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
      {/*{//TODO: TO FIX}*/}
      {/*<AssetCharacterFilters*/}
      {/*  assetType={ASSET_TYPE.CHARACTER}*/}
      {/*  section={SECTION.INVENTORY}*/}
      {/*  pageSelector={pageSelector}*/}
      {/*  assets={characters}*/}
      {/*  selectedOrigins={[]}*/}
      {/*  selectedTitles={[]}*/}
      {/*  selectedSorting={selectedSorting}*/}
      {/*  setSelectedSorting={setSelectedSorting}*/}
      {/*/>*/}
      <AssetFilterCount customColor={color.darkGrey}>Inventory: {text.param.amountOfCharacters(assetsCount)}</AssetFilterCount>
      <HorizontalDivider />
      {selectedId && <CharacterDetailsInventory character={character} />}
      {characters.length > 0 ? (
        <CharacterCardsInventory characters={characters} isLoading={isLoading} selectCharacter={(id: string) => setSelectedId(id)} />
      ) : (
        <OverviewContainer>
          <OverviewEmpty
            headingText={text.inventory.thereAreNoCharactersInTheInventory}
            descriptionText={text.inventory.thereAreNoCharactersAvailable}
            buttonText={text.character.buyCharactersFromStore}
            redirectRoute={routes.character}
            secondary
          />
        </OverviewContainer>
      )}
    </>
  );
};
