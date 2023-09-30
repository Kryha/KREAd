import React, { FC, useMemo, useState } from "react";
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
import { useUserState } from "../../../context/user";
import { useGetItemSelectionForCharacter } from "./hooks";

export const ItemCards: FC = () => {
  const { selectedAssetCategory, selectedAsset, showToast, setShowToast, setOnAssetChange, setSelectedAsset } = useCharacterBuilder();
  const { height } = useViewport();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCharacter] = useSelectedCharacter();
  const category = selectedAssetCategory ? selectedAssetCategory : "";
  const { items } = useUserState();

  const { equipped, unequipped, inCategory } = useGetItemSelectionForCharacter();

  const [equippedSelected, setEquippedSelected] = useState(false);
  const [equippedItemState, setEquippedItemState] = useState(equipped.inCategory);
  const equipItem = useEquipItem(setEquippedItemState);
  const unequipItem = useUnequipItem(() => setEquippedItemState(undefined));
  const selected = useMemo(() => {
    if (equippedSelected) return equipped.inCategory;
    return inCategory.find((item) => item.name === selectedAsset);
  }, [selectedAsset, items, equippedSelected]);

  const selectedItemIsEquipped = useMemo(() => {
    return selected?.equippedTo === selectedCharacter!.nft.name;
  }, [selected, selectedCharacter]);

  const equip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowToast(!showToast);
    if (selected) {
      equipItem.mutate({ item: selected });
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

  if (!selectedCharacter) {
    console.error("No character selected");
    return <></>;
  }

  const disable = useMemo(() => {
    return {
      unequip: !selected || !equippedSelected,
      equip: !selected || equippedSelected,
      sell: !selected || equippedSelected,
    };
  }, [equippedSelected, selected]);

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
        <AdjustedItemButtonContainer>
          <PrimaryButton disabled={disable.unequip} onClick={(event: React.MouseEvent<HTMLButtonElement>) => unequip(event)}>
            <ButtonText customColor={color.white}>unequip</ButtonText>
          </PrimaryButton>
          <PrimaryButton disabled={disable.equip} onClick={(event: React.MouseEvent<HTMLButtonElement>) => equip(event)}>
            <ButtonText customColor={color.white}>equip</ButtonText>
          </PrimaryButton>
          <PrimaryButton disabled={disable.sell} onClick={sell}>
            <ButtonText customColor={color.white}>sell</ButtonText>
          </PrimaryButton>
        </AdjustedItemButtonContainer>
      </ItemCardsWrapper>
    </ItemCardsContainer>
  );
};
