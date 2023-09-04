import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage, NotificationDetail, Overlay, OverviewEmpty } from "../../components";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { PageContainer } from "../../components/page-container";
import { CharactersList } from "../../containers/characters-list";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useUserStateDispatch } from "../../context/user";
import { routes } from "../../navigation";
import { useMyCharacter, useMyCharacters } from "../../service";
import { EmptyDetail } from "./empty-item-inventory";
import { DetailWrapper } from "./styles";
import { AssetFilters } from "../../components/asset-filters/asset-filters";
import { ASSET_TYPE, SECTION } from "../../constants";
import { AssetCards } from "../../components/asset-cards/asset-cards";
import { AssetDetails } from "../../components/asset-details/asset-details";
import { OverviewContainer } from "../shop/styles";

interface Props {
  pageSelector: React.ReactNode;
}

export const CharactersInventory: FC<Props> = ({ pageSelector }) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSorting, setSelectedSorting] = useState<string>("");

  // const userStateDispatch = useUserStateDispatch();
  const [characters, isLoadingCharacters] = useMyCharacters();
  const [character] = useMyCharacter(selectedId);
  // const [noCharacters, setNoCharacters] = useState(false);
  // const [showToast, setShowToast] = useState(false);
  console.log("CHARS characters", characters);
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
  console.log("CHAR", character);
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
      <AssetDetails
        assetType={ASSET_TYPE.CHARACTER}
        section={SECTION.INVENTORY}
        assetData={character}
        assetId={selectedId}
        setAssetId={setSelectedId}
      />
      {characters.length > 0 ? (
        <AssetCards
          assetType={ASSET_TYPE.CHARACTER}
          section={SECTION.INVENTORY}
          assetsData={characters}
          isLoading={isLoading}
          setAssetId={setSelectedId}
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
