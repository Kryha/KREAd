import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage, NotificationDetail, Overlay } from "../../components";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { PageContainer } from "../../components/page-container";
import { CharactersList } from "../../containers/characters-list";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useCharacterStateDispatch } from "../../context/characters";
import { routes } from "../../navigation";
import { useMyCharacter, useMyCharacters } from "../../service";
import { EmptyDetail } from "./empty-item-inventory";
import { DetailWrapper } from "./styles";

export const CharactersInventory: FC = () => {
  const navigate = useNavigate();

  const dispatch = useCharacterStateDispatch();

  const [selectedId, setSelectedId] = useState<string>("");
  const [characters, isLoadingCharacters] = useMyCharacters();
  const [character] = useMyCharacter(selectedId);
  const [noCharacters, setNoCharacters] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoadingCharacters || !!selectedId) return;
    if (characters.length) {
      setSelectedId(characters[0].nft.id);
    }
    setIsLoading(false);
  }, [characters, isLoadingCharacters, selectedId]);

  const select = () => {
    if (!character) return;
    const { isEquipped: _, ...rest } = character;
    dispatch({ type: "SET_SELECTED_CHARACTER", payload: rest });
  };

  const sell = () => {
    if (!selectedId) return;
    navigate(`${routes.sellCharacter}/${selectedId}`);
  };

  if (isLoadingCharacters || isLoading) return <LoadingPage />;

  if (!character) return <ErrorView />;

  const detailActions = () => {
    if (character.isEquipped) {
      return {
        secondary: { text: text.character.sell, onClick: sell },
      };
    } else {
      return {
        primary: { text: text.character.select, onClick: select },
        secondary: { text: text.character.sell, onClick: sell },
      };
    }
  };

  const onFilterChange = (items: boolean) => {
    setNoCharacters(items);
  };

  const displayToast = () => {
    setShowToast(true);
  };

  return (
    <PageContainer sidebarContent={<CharactersList onCharacterClick={setSelectedId} onFilterClick={onFilterChange} />}>
      <FadeInOut show>
        <DetailWrapper>
          {noCharacters ? (
            <EmptyDetail />
          ) : (
            <CharacterDetailSection character={character} equippedItems={character.equippedItems} actions={detailActions()} showToast={displayToast}/>

          )}
        </DetailWrapper>
      </FadeInOut>
      <FadeInOut show={showToast} exiting={!showToast}>
        {showToast && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showToast}>
          <NotificationDetail
            title={text.general.goToYourWallet}
            info={text.general.yourActionIsPending}
            closeToast={() => setShowToast(false)}
            isError
          />
        </NotificationWrapper>
      </FadeInOut>
    </PageContainer>
  );
};
