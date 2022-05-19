import { FC } from "react";

import { useViewport } from "../../hooks";

import { BaseCharacter, ErrorView, LoadingPage, MenuCard, } from "../../components";
import { ItemWrapper } from "./styles";
import { useMyItems, useMyCharacter } from "../../service";


export const Item: FC = () => {
  const { data: items, isLoading: isLoadingItems } = useMyItems();
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const { height } = useViewport();

  if (isLoadingItems || isLoadingCharacter) return <LoadingPage />;

  if (!items || !character || !items.length) return <ErrorView />;

  return (
    <ItemWrapper height={height}>
      <BaseCharacter character={character} size="extraLarge" isZoomed />
      <MenuCard title={items[0].category} items={items} amount={items.length} width={"150px"} height={"150px"} marginTop="-75px" marginLeft="-35px" />
    </ItemWrapper>
  );
};
