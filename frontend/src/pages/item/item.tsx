import { FC, useMemo } from "react";
import { useViewport } from "../../hooks";
import { BaseCharacter, ErrorView, LoadingPage, MenuCard } from "../../components";
import { ItemWrapper } from "./styles";
import { useGetItemsInInventory, useSelectedCharacter } from "../../service";
import { useParams } from "react-router-dom";
import { isItemCategory, Item } from "../../interfaces";
import { text } from "../../assets";
import { useWalletState } from "../../context/wallet";

export const ItemPage: FC = () => {
  const { height, width } = useViewport();
  const { category } = useParams<"category">();

  const [items, isLoadingItems] = useGetItemsInInventory();
  const { item: allUnequippedItems } = useWalletState();
  const [character, isLoadingCharacter] = useSelectedCharacter();

  const [equippedItem, unequippedItems]: [Item | undefined, Item[]] = useMemo(() => {
    if (!isItemCategory(category)) return [undefined, []];
    if (!allUnequippedItems) return [character?.equippedItems[category], []];

    return [character?.equippedItems[category], allUnequippedItems.filter((item) => item.category === category)];
  }, [category, character?.equippedItems, items]);

  if (isLoadingItems || isLoadingCharacter) return <LoadingPage spinner={false} />;

  if (!category || !character || !isItemCategory(category)) return <ErrorView />;

  return (
    <ItemWrapper height={height} position={category} width={width}>
      <BaseCharacter
        characterImage={character.nft.image}
        items={character.equippedItems}
        size="extraLarge"
        isZoomed
        isClothing={category === "clothing"}
      />
      <MenuCard title={text.param.categories[category]} category={category} equippedItemProp={equippedItem} unequippedItems={unequippedItems} />
    </ItemWrapper>
  );
};
