import { FC, useMemo } from "react";

import { useViewport } from "../../hooks";
import { BaseCharacter, ErrorView, LoadingPage, MenuCard } from "../../components";
import { ItemWrapper } from "./styles";
import { useMyItems, useSelectedCharacter } from "../../service";
import { useParams } from "react-router-dom";
import { isItemCategory, Item } from "../../interfaces";
import { text } from "../../assets";

export const ItemPage: FC = () => {
  const { height, width } = useViewport();
  const { category } = useParams<"category">();

  const [{ owned }, isLoadingItems] = useMyItems();
  const [character, isLoadingCharacter] = useSelectedCharacter();

  const [equippedItem, unequippedItems]: [Item | undefined, Item[]] = useMemo(() => {
    if (!isItemCategory(category)) return [undefined, []];

    return [character?.equippedItems[category], owned.filter((item) => item.category === category)];
  }, [category, character?.equippedItems, owned]);

  if (isLoadingItems || isLoadingCharacter) return <LoadingPage />;

  if (!category || !character || !isItemCategory(category)) return <ErrorView />;

  return (
    <ItemWrapper height={height} position={category} width={width}>
      <BaseCharacter items={character.equippedItems} size="extraLarge" isZoomed />
      <MenuCard title={text.param.categories[category]} equippedItem={equippedItem} unequippedItems={unequippedItems} />
    </ItemWrapper>
  );
};
