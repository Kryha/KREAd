import React, { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { useEquipItem, useGetItemsInInventoryByCategory, useSelectedCharacter, useUnequipItem } from "../../../service";
import { ButtonText, HorizontalDivider, PrimaryButton, SecondaryButton } from "../../../components";
import { MAIN_MODE } from "../../../constants";
import { StoreIcon } from "../../../assets";
import {
  CanvasAssetContainer,
  CanvasAssetHeader,
  CanvasAssetInventoryWrapper,
  CanvasContentWrapper,
  CardActionsContainer,
  Store,
} from "../style";
import { ItemCards } from "../item-cards/item-cards";
import { routes } from "../../../navigation";
import { ModeScroller } from "../mode-scroller/mode-scroller";
import { color } from "../../../design";
import { useGetItemSelectionForCharacter } from "../item-cards/hooks";
import { ItemNotifications } from "./item-notifications";

export const ItemsMode: FC = () => {
  const navigate = useNavigate();
  const { selectedAssetCategory, selectedAsset, setOnAssetChange, showToast, setShowToast, setSelectedAsset, setInteractionMode } =
    useCharacterBuilder();
  const [selectedCharacter] = useSelectedCharacter();
  const characterName = selectedCharacter?.nft.name;
  const [items] = useGetItemsInInventoryByCategory(selectedAssetCategory);

  const { equipped, unequipped, inCategory } = useGetItemSelectionForCharacter();

  const [equippedSelected, setEquippedSelected] = useState(false);

  const selected = useMemo(() => {
    if (equippedSelected) return equipped.inCategory;
    return inCategory.find((item) => item.name === selectedAsset);
  }, [selectedAsset, items, equippedSelected]);

  const selectedItemIsEquipped = useMemo(() => {
    return selected?.equippedTo === selectedCharacter?.nft.name;
  }, [selected, selectedCharacter]);

  const equippedItem = items.find((item) => item.equippedTo === characterName);
  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  // Always select the equipped item on default
  useEffect(() => {
    if (equippedItem) {
      setSelectedAsset(equippedItem.name);
    }
  }, [equippedItem]);

  const equip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (equipped.inCategory && selected) {
      equipItem.mutate({
        item: selected,
        currentlyEquipped: equipped.inCategory,
        callback: {},
      });
    }
    setOnAssetChange(false);
    setShowToast(!showToast);
    if (!equipped.inCategory && selected) {
      equipItem.mutate({ item: selected, callback: {} });
    }
  };

  const unequip = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOnAssetChange(false);
    setShowToast(!showToast);
    if (equipped.inCategory) {
      unequipItem.mutate({ item: equipped.inCategory, callback: {} });
    }
  };

  const sell = () => {
    if (!selectedAsset) return;
    navigate(`${routes.sellItem}/${selectedAssetCategory}/${selectedAsset}`, {
      state: location,
    });
  };

  const disable = useMemo(() => {
    return {
      unequip: !selected || !equippedSelected,
      equip: !selected || equippedSelected,
      sell: !selected || equippedSelected,
    };
  }, [equippedSelected, selected]);
  if (!selectedCharacter) {
    console.error("No character selected");
    return <></>;
  }

  return (
    <>
      <CanvasAssetInventoryWrapper>
        <CanvasAssetContainer>
          <CanvasAssetHeader>
            <ModeScroller />
          </CanvasAssetHeader>
          <CanvasContentWrapper>
            <ItemCards
              equipped={equipped}
              unequipped={unequipped}
              equippedSelected={equippedSelected}
              setEquippedSelected={setEquippedSelected}
              selectedItemIsEquipped={selectedItemIsEquipped}
            />
            <HorizontalDivider />
            <CardActionsContainer>
              <PrimaryButton
                disabled={disable.unequip}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  unequip(event);
                }}
              >
                <ButtonText customColor={color.white}>unequip</ButtonText>
              </PrimaryButton>
              <PrimaryButton
                disabled={disable.equip}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  equip(event);
                }}
              >
                <ButtonText customColor={color.white}>equip</ButtonText>
              </PrimaryButton>
              <PrimaryButton disabled={disable.sell} onClick={sell}>
                <ButtonText customColor={color.white}>sell</ButtonText>
              </PrimaryButton>
              <Store>
                <SecondaryButton
                  type="submit"
                  onClick={() => {
                    setInteractionMode(MAIN_MODE);
                    navigate(`${routes.shop}/items`);
                  }}
                >
                  <StoreIcon />
                </SecondaryButton>
              </Store>
            </CardActionsContainer>
          </CanvasContentWrapper>
        </CanvasAssetContainer>
      </CanvasAssetInventoryWrapper>
      <ItemNotifications selected={selected} equip={equip} />
    </>
  );
};
