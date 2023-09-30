import React, { FC } from "react";
import { ButtonText, HorizontalDivider, ItemCard } from "../../../components";
import { color } from "../../../design";
import { useViewport } from "../../../hooks";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { AssetFilterCount } from "../../../components/asset-item-filters/styles";
import { text } from "../../../assets";
import { EmptyItemCardContainer, ItemCardContainer, ItemCardsContainer, ItemCardsWrapper } from "./style";
import { ItemCardInfo } from "./item-card-info";
import { useUserState } from "../../../context/user";
import { Item } from "../../../interfaces";

interface Props {
  equipped: { all: (Item | undefined)[]; inCategory: Item | undefined };
  unequipped: { all: Item[]; inCategory: Item[] };
  equippedSelected: boolean;
  setEquippedSelected: (value: boolean) => void;
  selectedItemIsEquipped: boolean;
}
export const ItemCards: FC<Props> = ({ equipped, unequipped, equippedSelected, setEquippedSelected, selectedItemIsEquipped }) => {
  const { selectedAssetCategory, selectedAsset, setOnAssetChange, setSelectedAsset } = useCharacterBuilder();
  const { height } = useViewport();
  const category = selectedAssetCategory ? selectedAssetCategory : "";
  const { items } = useUserState();

  // Filter out the selectedItem from the items array
  const filteredItems = items.filter((item) => item.equippedTo === "");
  const itemsCount = filteredItems.length;

  return (
    <ItemCardsContainer>
      {equipped.inCategory ? (
        <>
          <AssetFilterCount customColor={color.darkGrey}>Equipped {(text.param.categories as any)[category]}</AssetFilterCount>
          <HorizontalDivider />
          <ItemCardContainer
            isSelected={equippedSelected && selectedItemIsEquipped}
            onClick={() => {
              setEquippedSelected(true);
              setSelectedAsset(equipped.inCategory?.name || null);
              setOnAssetChange(false);
            }}
          >
            <ItemCard item={equipped.inCategory} image={equipped.inCategory?.thumbnail} />
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
                isSelected={!equippedSelected && item.name === selectedAsset}
                onClick={() => {
                  setEquippedSelected(false);
                  setSelectedAsset(item.name);
                  setOnAssetChange(true);
                }}
              >
                <ItemCard key={index} item={item} image={item.thumbnail} />
                <ItemCardInfo item={item} />
              </ItemCardContainer>
            ))
          : null}
      </ItemCardsWrapper>
    </ItemCardsContainer>
  );
};
