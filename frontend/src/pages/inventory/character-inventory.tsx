import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { PageContainer } from "../../components/page-container";
import { CharactersList } from "../../containers/characters-list";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useCharacterStateDispatch } from "../../context/characters";
import { routes } from "../../navigation";
import { useMyCharacter, useMyCharacters } from "../../service";
import { DetailWrapper } from "./styles";

export const CharactersInventory: FC = () => {
  const navigate = useNavigate();

  const dispatch = useCharacterStateDispatch();

  const [selectedId, setSelectedId] = useState<string>("");
  const [characters, isLoadingCharacters] = useMyCharacters();
  const [character] = useMyCharacter(selectedId);

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

  return (
    <PageContainer sidebarContent={<CharactersList onCharacterClick={setSelectedId} />}>
      <FadeInOut show>
        <DetailWrapper>
          <CharacterDetailSection character={character.nft} actions={detailActions()} />
        </DetailWrapper>
      </FadeInOut>
    </PageContainer>
  );
};
