import { FC, useMemo, useState } from "react";

import { BaseRoute, ErrorView, LoadingPage } from "../../components";
import { text } from "../../assets/text";
import { PageContainer } from "../../components/page-container";
import { CharacterDetailSection, ItemDetailSection } from "../../containers/detail-section";
import { Title } from "../../components/title";
import { ItemsList } from "../../containers/items-list";
import { useCharacters, useItems } from "../../service";
import { CharactersList } from "../../containers/characters-list";

const ItemsInventory: FC = () => {
  const { data: items, isLoading, isError } = useItems();
  const [selectedId, setSelectedId] = useState<string>("");

  const item = useMemo(() => items?.find((item) => item.id === selectedId), [items, selectedId]);

  if (isLoading) return <LoadingPage />;

  if (isError || !items || !items.length) return <ErrorView />;

  return (
    <PageContainer sidebarContent={<ItemsList onItemClick={setSelectedId} />}>
      <ItemDetailSection item={item || items[0]} />
    </PageContainer>
  );
};

// TODO: uncomment when designs will be done
const CharactersInventory: FC = () => {
  const { data: characters, isLoading, isError } = useCharacters();
  const [selectedId, setSelectedId] = useState<string>("");

  const character = useMemo(() => characters?.find((character) => character.characterId === selectedId), [characters, selectedId]);

  if (isLoading) return <LoadingPage />;

  if (isError || !characters || !characters.length) return <ErrorView />;

  return (
    <PageContainer sidebarContent={<CharactersList onCharacterClick={setSelectedId} />}>
      <CharacterDetailSection character={character || characters[0]} />
    </PageContainer>
  );
};

export const Inventory: FC = () => {
  // TODO: switch between items and characters
  return (
    <BaseRoute sideNavigation={<Title title={text.navigation.inventory} />}>
      <CharactersInventory />;
    </BaseRoute>
  );
};
