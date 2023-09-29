import React, { FC, useEffect, useMemo, useState } from "react";
import { ButtonText, HorizontalDivider, ItemCard, PrimaryButton } from "../../../components";
import { color } from "../../../design";
import { useEquipItem, useSelectedCharacter, useUnequipItem } from "../../../service";
import { useViewport } from "../../../hooks";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { AssetFilterCount } from "../../../components/asset-item-filters/styles";
import { text } from "../../../assets";
import { EmptyItemCardContainer, AdjustedItemButtonContainer, ItemCardContainer, ItemCardsContainer, ItemCardsWrapper } from "./style";
import { routes } from "../../../navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { ItemCardInfo } from "./item-card-info";
import { Category } from "../../../interfaces";
import { useUserState } from "../../../context/user";

export const ItemCards: FC = () => {
  const { selectedAssetCategory, selectedAsset, showToast, setShowToast, setOnAssetChange, setSelectedAsset } = useCharacterBuilder();
  const { height } = useViewport();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCharacter] = useSelectedCharacter();
  const category = selectedAssetCategory ? selectedAssetCategory : "";
  const { items } = useUserState();

  const equippedItems = useMemo(() => {
    if(!selectedCharacter) return [];
    const equipped = Object.values(selectedCharacter.equippedItems).filter(i=>!!i);
    return equipped;
  }, [selectedCharacter])
  
  const allUsableItems = useMemo(()=> [...items, ...equippedItems], [selectedCharacter, items])
  const [equippedItem, setEquippedItem] = useState(selectedCharacter?.equippedItems[selectedAssetCategory as Category] || undefined);
  const selectedItem = useMemo(()=>{
    return items.find((item) => item.name === selectedAsset );
  },[selectedAsset, items]);
  const [equippedItemState, setEquippedItemState] = useState(equippedItem);
  const equipItem = useEquipItem(setEquippedItemState);
  const unequipItem = useUnequipItem(() => setEquippedItemState(undefined));
  const selectedItemIsEquipped = useMemo(()=>{
    return selectedItem?.equippedTo===selectedCharacter!.nft.name;
  }, [selectedItem, selectedCharacter]);

  const equip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowToast(!showToast);
    if (selectedItem) {
      equipItem.mutate({ item: selectedItem });
    }
  };

  const unequip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowToast(!showToast);
    if (equippedItemState) {
      unequipItem.mutate({ item: equippedItemState });
    }
    setEquippedItem(undefined);
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
      unequip: selectedItemIsEquipped,
      equip: !!(selectedItem?.equippedTo===selectedCharacter.nft.name) || !selectedItem,
      sell: !!(selectedItem?.equippedTo===selectedCharacter.nft.name) || !selectedItem,
    };
  }, [selectedItem, equippedItem]);

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
