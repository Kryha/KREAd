import { FC, useMemo, useState } from "react";

import { BaseRoute, ErrorView, LoadingPage, OverviewEmpty, SwitchSelector } from "../../components";
import { text } from "../../assets/text";
import { PageContainer } from "../../components/page-container";
import { CharacterDetailSection, ItemDetailSection } from "../../containers/detail-section";
import { Title } from "../../components/title";
import { ItemsList } from "../../containers/items-list";
import { useCharacters, useItems } from "../../service";
import { CharactersList } from "../../containers/characters-list";
import { routes } from "../../navigation";
import { useNavigate } from "react-router-dom";
import { Page } from "../shop";
import { InventoryWrapper,  OverviewContainer } from "./styles";
import { EmptyCard } from "../../components/empty-card";

const ItemsInventory: FC = () => {
  const { data: items, isLoading, isError } = useItems();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>("");

  const item = useMemo(() => items?.find((item) => item.id === selectedId), [items, selectedId]);

  const equip = () => {
    // TODO: implement item equip
    console.log("TODO: implement item equip");
  };

  const sell = () => {
    if (!selectedId) return;
    navigate(`${routes.sellItem}/${selectedId}`);
  };

  if (isLoading) return <LoadingPage />;

  if (isError) return <ErrorView />;
  const isEmpty = !items || !items.length;
  const equipItems = () => {
    console.log("djh");
  };

  return (
    <PageContainer sidebarContent={
      isEmpty ? (
        <EmptyCard title={text.item.noItemsInInventory} description={text.item.buyItemsFromStore} />
      ) : (
        <ItemsList onItemClick={setSelectedId} />
      )
    }>
      {isEmpty ? (
        <OverviewContainer>
          <OverviewEmpty
            headingText={text.item.noItemEquipped}
            descriptionText={text.item.youDidNotEquipp}
            buttonText={text.item.startEquipping}
            onButtonClick={equipItems}
          />
        </OverviewContainer>
      ) : (
        <ItemDetailSection
          item={item || items[0]}
          actions={{ primary: { text: text.item.equip, onClick: equip }, secondary: { text: text.item.sell, onClick: sell } }}
        />
      )}
    </PageContainer>
  );
};

// TODO: uncomment when designs will be done
const CharactersInventory: FC = () => {
  const navigate = useNavigate();
  const { data: characters, isLoading, isError } = useCharacters();
  const [selectedId, setSelectedId] = useState<string>("");

  const character = useMemo(() => characters?.find((character) => character.characterId === selectedId), [characters, selectedId]);

  const choose = () => {
    // TODO: implement character choose
    console.log("TODO: implement character choose");
  };

  const sell = () => {
    if (!selectedId) return;
    navigate(`${routes.sellCharacter}/${selectedId}`);
  };

  if (isLoading) return <LoadingPage />;

  if (isError || !characters || !characters.length) return <ErrorView />;

  return (
    <PageContainer sidebarContent={<CharactersList onCharacterClick={setSelectedId} />}>
      <CharacterDetailSection
        character={character || characters[0]}
        actions={{ primary: { text: text.character.choose, onClick: choose }, secondary: { text: text.character.sell, onClick: sell } }}
      />
    </PageContainer>
  );
};

export const Inventory: FC = () => {
  const [selectedPage, setSelectedPage] = useState<Page>(Page.Items);

  const pageSelector = useMemo(
    () => (
      <SwitchSelector
        buttonOneText={text.character.items}
        buttonTwoText={text.character.characters}
        setSelectedIndex={setSelectedPage}
        selectedIndex={selectedPage}
      />
    ),
    [selectedPage]
  );
  // TODO: switch between items and characters
  return (
    <BaseRoute sideNavigation={<Title title={text.navigation.inventory} />}>
      <InventoryWrapper>{pageSelector}</InventoryWrapper>
      {selectedPage === Page.Items  ? <ItemsInventory /> : <CharactersInventory />}
    </BaseRoute>
  );
};
