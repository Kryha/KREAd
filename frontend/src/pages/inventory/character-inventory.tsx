import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { text } from "../../assets";
import { ErrorView, FadeInOut, LoadingPage } from "../../components";
import { PageContainer } from "../../components/page-container";
import { CharactersList } from "../../containers/characters-list";
import { CharacterDetailSection } from "../../containers/detail-section";
import { routes } from "../../navigation";
import { useMyCharacter, useMyCharacters } from "../../service";
import { DetailWrapper } from "./styles";

export const CharactersInventory: FC = () => {
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string>("");
  const [characters, isLoadingCharacters] = useMyCharacters();
  const [character] = useMyCharacter(selectedId);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoadingCharacters || !!selectedId) return;
    if (characters.length) {
      setSelectedId(characters[0].id.toString());
    }
    setIsLoading(false);
  }, [characters, isLoadingCharacters, selectedId]);

  const choose = () => {
    // TODO: implement character choose
    console.log("TODO: implement character choose");
  };

  const sell = () => {
    if (!selectedId) return;
    navigate(`${routes.sellCharacter}/${selectedId}`);
  };

  if (isLoadingCharacters || isLoading) return <LoadingPage />;

  if (!character) return <ErrorView />;

  return (
    <PageContainer sidebarContent={<CharactersList onCharacterClick={setSelectedId} />}>
      <FadeInOut show>
        <DetailWrapper>
          <CharacterDetailSection
            character={character}
            actions={{
              primary: { text: text.character.choose, onClick: choose },
              secondary: { text: text.character.sell, onClick: sell },
            }}
          />
        </DetailWrapper>
      </FadeInOut>
    </PageContainer>
  );
};
