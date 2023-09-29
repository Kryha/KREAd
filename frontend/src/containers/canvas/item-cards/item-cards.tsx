import React, { FC, useEffect, useMemo, useState } from "react";
import { ButtonText, HorizontalDivider, ItemCard, PrimaryButton } from "../../../components";
import { color } from "../../../design";
import { useEquipItem, useGetItemsInInventoryByCategory, useSelectedCharacter, useUnequipItem } from "../../../service";
import { useViewport } from "../../../hooks";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { AssetFilterCount } from "../../../components/asset-item-filters/styles";
import { text } from "../../../assets";
import { EmptyItemCardContainer, AdjustedItemButtonContainer, ItemCardContainer, ItemCardsContainer, ItemCardsWrapper } from "./style";
import { routes } from "../../../navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { ItemCardInfo } from "./item-card-info";

export const ItemCards: FC = () => {
  const { selectedAssetCategory, selectedAsset, showToast, setShowToast, setOnAssetChange, setSelectedAsset } = useCharacterBuilder();
  const { height } = useViewport();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCharacter] = useSelectedCharacter();
  const characterName = selectedCharacter?.nft.name;
  const category: string = selectedAssetCategory ? selectedAssetCategory : "";
  const [items] = useGetItemsInInventoryByCategory(selectedAssetCategory);

  const equippedItem = items.find((item) => item.equippedTo === characterName);
  const selectedItemToEquip = items.find((item) => item.name === selectedAsset);
  const [equippedItemState, setEquippedItemState] = useState(equippedItem);

  const equipItem = useEquipItem(setEquippedItemState);
  const unequipItem = useUnequipItem(() => setEquippedItemState(undefined));

  const equip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowToast(!showToast);
    if (selectedItemToEquip) {
      equipItem.mutate({ item: selectedItemToEquip });
    }
  };

  const unequip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowToast(!showToast);
    if (equippedItemState) {
      unequipItem.mutate({ item: equippedItemState });
    }
  };

  const sell = () => {
    if (!selectedAsset) return;
    navigate(`${routes.sellItem}/${selectedAssetCategory}/${selectedAsset}`, {
      state: location,
    });
  };

  useEffect(() => {
    if (selectedAsset === null && equippedItem) {
      setSelectedAsset(equippedItem?.name);
    }
  }, [equippedItem, selectedAsset]);

  if (!selectedCharacter) {
    console.error("No character selected");
    return <></>;
  }
  const validateActions = useMemo(() => {
    return {
      unequip: !(selectedItemToEquip?.equippedTo === selectedCharacter.nft.name),
      equip: !!(selectedItemToEquip?.equippedTo === selectedCharacter.nft.name) || !selectedItemToEquip,
      sell: !!(selectedItemToEquip?.equippedTo === selectedCharacter.nft.name) || !selectedItemToEquip,
    };
  }, [equippedItemState, selectedItemToEquip, selectedAsset]);

  // Filter out the selectedItem from the items array
  const filteredItems = items.filter((item) => item.equippedTo === "");
  const itemsCount = filteredItems.length;

  return (
    <ItemCardsContainer>
      {equippedItem ? (
        <>
          <AssetFilterCount customColor={color.darkGrey}>Equipped {(text.param.categories as any)[category]}</AssetFilterCount>
          <HorizontalDivider />
          <ItemCardContainer
            isSelected={selectedAsset === equippedItem.name}
            onClick={() => {
              setSelectedAsset(equippedItem.name);
              setOnAssetChange(false);
            }}
          >
            <ItemCard item={equippedItem} image={equippedItem?.thumbnail} />
            <ItemCardInfo item={equippedItem} />
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
          ? filteredItems.map((item, index) => (
              <ItemCardContainer
                key={index}
                isSelected={selectedAsset === item.name}
                onClick={() => {
                  setSelectedAsset(item.name);
                  setOnAssetChange(true);
                }}
              >
                <ItemCard key={index} item={item} image={item.thumbnail} />
                <ItemCardInfo item={item} />
              </ItemCardContainer>
            ))
          : null}
        <AdjustedItemButtonContainer>
          <PrimaryButton disabled={validateActions.unequip} onClick={(event: React.MouseEvent<HTMLButtonElement>) => unequip(event)}>
            <ButtonText customColor={color.white}>unequip</ButtonText>
          </PrimaryButton>
          <PrimaryButton disabled={validateActions.equip} onClick={(event: React.MouseEvent<HTMLButtonElement>) => equip(event)}>
            <ButtonText customColor={color.white}>equip</ButtonText>
          </PrimaryButton>
          <PrimaryButton disabled={validateActions.sell} onClick={sell}>
            <ButtonText customColor={color.white}>sell</ButtonText>
          </PrimaryButton>
        </AdjustedItemButtonContainer>
      </ItemCardsWrapper>
    </ItemCardsContainer>
  );
};
