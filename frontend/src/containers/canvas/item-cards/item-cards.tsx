import React, { FC, useEffect, useState } from "react";
import { ButtonText, HorizontalDivider, Img } from "../../../components";
import { color } from "../../../design";
import { useViewport } from "../../../hooks";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { AssetFilterCount } from "../../../components/asset-item-filters/styles";
import { text } from "../../../assets";
import { EmptyItemCardContainer, EquippedContainer, ItemCardContainer, ItemCardsContainer, ItemCardsWrapper, ItemImageCard } from "./style";
import { ItemCardInfo } from "./item-card-info";
import { Item } from "../../../interfaces";
import { useGetItemsInInventoryByCategory } from "../../../service";
import { Equipped } from "../../../components/asset-card/styles";

interface Props {
  equipped: { all: (Item | undefined)[]; inCategory: Item | undefined };
  unequipped: { all: Item[]; inCategory: Item[] };
  equippedSelected: boolean;
  setEquippedSelected: (value: boolean) => void;
  selectedItemIsEquipped: boolean;
}
export const ItemCards: FC<Props> = ({ equipped, unequipped, equippedSelected, setEquippedSelected, selectedItemIsEquipped }) => {
  const { selectedAssetCategory, setOnAssetChange, setSelectedAsset, setCharacterName } = useCharacterBuilder();
  const { height } = useViewport();
  const category = selectedAssetCategory ? selectedAssetCategory : "";
  const [items] = useGetItemsInInventoryByCategory(selectedAssetCategory);

  //If two items in the inventory have the same name, we will distinguish them by their index in the array
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<number | null>(null);

  // Filter out the selectedItem from the items array
  const filteredItems = items.filter((item) => item.equippedTo === "");
  const itemsCount = filteredItems.length;

  useEffect(() => {
    if (selectedItemIsEquipped) {
      setEquippedSelected(true);
    }
  }, [equipped.inCategory, selectedItemIsEquipped]);

  return (
    <ItemCardsContainer>
      {equipped.inCategory ? (
        <>
          <AssetFilterCount customColor={color.darkGrey}>Equipped {(text.param.categories as any)[category]}</AssetFilterCount>
          <ItemCardContainer
            isSelected={selectedItemIsEquipped}
            onClick={() => {
              setEquippedSelected(true);
              setSelectedAsset(equipped.inCategory?.name || null);
              setOnAssetChange(false);
              setCharacterName(equipped.inCategory?.equippedTo);
            }}
          >
            <ItemImageCard>
              {equipped.inCategory.equippedTo && (
                <EquippedContainer>
                  <Equipped />
                </EquippedContainer>
              )}
              <Img src={equipped.inCategory?.thumbnail} />
            </ItemImageCard>
            <ItemCardInfo item={equipped.inCategory} />
          </ItemCardContainer>
        </>
      ) : (
        <EmptyItemCardContainer>
          <ButtonText>No {(text.param.categories as any)[category]} equipped</ButtonText>
        </EmptyItemCardContainer>
      )}
      <AssetFilterCount customColor={color.darkGrey}>
        {itemsCount} {(text.param.assetCategories as any)[category]} in inventory
      </AssetFilterCount>
      <HorizontalDivider />
      <ItemCardsWrapper height={height}>
        {filteredItems
          ? unequipped.inCategory.map((item, index) => (
              <ItemCardContainer
                key={index}
                isSelected={!equippedSelected && index === selectedAssetIndex}
                onClick={() => {
                  setEquippedSelected(false);
                  setSelectedAsset(item.name);
                  setOnAssetChange(true);
                  setCharacterName(item.equippedTo);
                  setSelectedAssetIndex(index);
                }}
              >
                <ItemImageCard>
                  <Img key={index} src={item.thumbnail} />
                </ItemImageCard>
                <ItemCardInfo item={item} />
              </ItemCardContainer>
            ))
          : null}
      </ItemCardsWrapper>
    </ItemCardsContainer>
  );
};
