import React, { FC } from "react";
import { ButtonText, HorizontalDivider, Img } from "../../../components";
import { color } from "../../../design";
import { useViewport } from "../../../hooks";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { AssetFilterCount } from "../../../components/asset-item-filters/styles";
import { text } from "../../../assets";
import { EmptyItemCardContainer, ItemCardContainer, ItemCardsContainer, ItemCardsWrapper, ItemImageCard } from "./style";
import { ItemCardInfo } from "./item-card-info";
import { Item } from "../../../interfaces";
import { useGetItemsInInventoryByCategory } from "../../../service";
import { Equipped } from "../../../components/asset-card/styles";
import styled from "@emotion/styled";

interface Props {
  equipped: { all: (Item | undefined)[]; inCategory: Item | undefined };
  unequipped: { all: Item[]; inCategory: Item[] };
  equippedSelected: boolean;
  setEquippedSelected: (value: boolean) => void;
  selectedItemIsEquipped: boolean;
}
export const ItemCards: FC<Props> = ({ equipped, unequipped, equippedSelected, setEquippedSelected, selectedItemIsEquipped }) => {
  const { selectedAssetCategory, selectedAsset, setOnAssetChange, setSelectedAsset, setCharacterName } = useCharacterBuilder();
  const { height } = useViewport();
  const category = selectedAssetCategory ? selectedAssetCategory : "";
  const [items] = useGetItemsInInventoryByCategory(selectedAssetCategory);

  // Filter out the selectedItem from the items array
  const filteredItems = items.filter((item) => item.equippedTo === "");
  const itemsCount = filteredItems.length;

  return (
    <ItemCardsContainer>
      {equipped.inCategory ? (
        <>
          <AssetFilterCount customColor={color.darkGrey}>Equipped {(text.param.categories as any)[category]}</AssetFilterCount>
          <ItemCardContainer
            isSelected={equippedSelected && selectedItemIsEquipped}
            onClick={() => {
              setEquippedSelected(true);
              setSelectedAsset(equipped.inCategory?.name || null);
              setOnAssetChange(false);
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
                isSelected={!equippedSelected && item.name === selectedAsset}
                onClick={() => {
                  setEquippedSelected(false);
                  setSelectedAsset(item.name);
                  setOnAssetChange(true);
                  setCharacterName(item.equippedTo);
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

export const EquippedContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;

  ${Equipped} {
    width: 24px;
    height: 24px;
  }
`;
