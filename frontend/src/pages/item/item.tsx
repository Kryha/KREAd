import { FC } from "react";

import { useViewport } from "../../hooks";

import { BaseCharacter, ErrorView, LoadingPage, MenuCard } from "../../components";
import { ItemWrapper } from "./styles";
import { useMyItems, useMyCharacter } from "../../service";
import { useParams } from "react-router-dom";
import { Character } from "../../interfaces";

export const Item: FC = () => {
  const { category } = useParams<"category">();
  const [items, isLoadingItems] = useMyItems();
  const [
    {
      selected: [character],
      isLoading: isLoadingCharacter,
    },
  ] = useMyCharacter();
  const { height, width } = useViewport();

  // const categoryItems = [character.items["mask"]];
  const categoryItems = items.filter((item) => item.category === category);
  console.log("🚀 ~ file: item.tsx ~ line 24 ~ categoryItems", categoryItems);

  if (isLoadingItems || isLoadingCharacter) return <LoadingPage />;

  if (!category || !character) return <ErrorView />;

  return (
    <ItemWrapper height={height} position={category} width={width}>
      <BaseCharacter items={character.items} size="extraLarge" isZoomed />
      <MenuCard title={category} items={categoryItems} />
    </ItemWrapper>
  );
};
