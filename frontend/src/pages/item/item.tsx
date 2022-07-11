import { FC } from "react";

import { useViewport } from "../../hooks";

import { BaseCharacter, ErrorView, LoadingPage, MenuCard } from "../../components";
import { ItemWrapper } from "./styles";
import { useMyItems, useMyCharacter } from "../../service";
import { useParams } from "react-router-dom";

export const Item: FC = () => {
  const { category } = useParams<"category">();
  const [items, isLoadingItems] = useMyItems();
  const { data: character, isLoading: isLoadingCharacter, isError: isErrorCharacters } = useMyCharacter();
  const { height, width } = useViewport();

  if (isLoadingItems || isLoadingCharacter) return <LoadingPage />;

  if (!items || !character || !items.length || !category || isErrorCharacters) return <ErrorView />;

  const categoryItems = items.filter((item) => item.category === category);

  return (
    <ItemWrapper height={height} position={category} width={width}>
      <BaseCharacter items={character.items} size="extraLarge" isZoomed />
      <MenuCard title={category} items={categoryItems} amount={categoryItems.length} />
    </ItemWrapper>
  );
};
