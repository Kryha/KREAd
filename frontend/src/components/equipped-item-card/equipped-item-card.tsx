import { Category, Item } from "../../interfaces";
import React, { FC } from "react";

import { ItemCard } from "../item-card";
import { VerticalInfo } from "../vertical-info";
import { EquippedContainer, ItemCount } from "./styles";
import { useCharacterBuilder } from "../../context/character-builder-context";
import { ITEM_MODE } from "../../constants";
import { useGetItemsInInventory } from "../../service";
import { ItemCategoryCounts } from "../../containers/canvas/category-cards/category-cards";
import { ButtonText } from "../atoms";

interface EquippedItemCardProps {
  item?: Item;
  code: string;
  width?: string;
  height?: string;
  marginTop?: string;
  marginLeft?: string;
  marginRight?: string;
  marginBottom?: string;
  category: Category;
  area: "top" | "middle" | "bottom";
}

export const LeftEquippedItemCard: FC<EquippedItemCardProps> = ({
  item,
  code,
  width,
  height,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  category,
  area,
}) => {
  const { setSelectedAsset, setSelectedAssetCategory, setInteractionMode } = useCharacterBuilder();
  const [availableItems] = useGetItemsInInventory();

  const unequippedAvailableItems = availableItems.filter((item) => item.equippedTo === "");
  const itemCategoryCounts: ItemCategoryCounts = unequippedAvailableItems.reduce((countObj: ItemCategoryCounts, item) => {
    const { category } = item;
    countObj[category] = (countObj[category] || 0) + 1;
    return countObj;
  }, {});

  const handleClick = () => {
    setInteractionMode(ITEM_MODE);
    setSelectedAssetCategory(category as string);
    setSelectedAsset(item?.name || "None");
  };

  return (
    <EquippedContainer onClick={() => handleClick()} isRight={false}>
      <ItemCard
        position="left"
        area={area}
        item={item}
        image={item?.thumbnail}
        width={width}
        height={height}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight}
      />
      {itemCategoryCounts[category] !== undefined ? (
        <ItemCount>
          <ButtonText>{itemCategoryCounts[category]}</ButtonText>
        </ItemCount>
      ) : null}
      <VerticalInfo code={code} />
    </EquippedContainer>
  );
};

export const RightEquippedItemCard: FC<EquippedItemCardProps> = ({
  item,
  code,
  width,
  height,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  category,
  area,
}) => {
  const { setSelectedAsset, setSelectedAssetCategory, setInteractionMode } = useCharacterBuilder();
  const [availableItems] = useGetItemsInInventory();

  const unequippedAvailableItems = availableItems.filter((item) => item.equippedTo === "");
  const itemCategoryCounts: ItemCategoryCounts = unequippedAvailableItems.reduce((countObj: ItemCategoryCounts, item) => {
    const { category } = item;
    countObj[category] = (countObj[category] || 0) + 1;
    return countObj;
  }, {});

  const handleClick = () => {
    setInteractionMode(ITEM_MODE);
    setSelectedAssetCategory(category as string);
    setSelectedAsset(item?.name || "None");
  };

  return (
    <EquippedContainer onClick={() => handleClick()} isRight isSecond={code === "perk 1" || code === "filter 1"}>
      <ItemCard
        position="right"
        area={area}
        item={item}
        image={item?.thumbnail}
        width={width}
        height={height}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight}
      />
      {itemCategoryCounts[category] !== undefined ? (
        <ItemCount>
          <ButtonText>{itemCategoryCounts[category]}</ButtonText>
        </ItemCount>
      ) : null}
      <VerticalInfo code={code} isRight />
    </EquippedContainer>
  );
};
