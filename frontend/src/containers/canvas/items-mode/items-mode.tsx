import React, { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { useEquipItem, useGetItemsInInventoryByCategory, useSelectedCharacter, useUnequipItem } from "../../../service";
import { ButtonText, FadeInOut, Overlay, PrimaryButton, SecondaryButton } from "../../../components";
import { CATEGORY_MODE, MAIN_MODE } from "../../../constants";
import { text } from "../../../assets";
import { CanvasAssetContainer, CanvasAssetHeader, CanvasAssetInventoryWrapper, CanvasContentWrapper, CardActionsContainer } from "../style";
import { ItemCards } from "../item-cards/item-cards";
import { ArrowUpRight } from "../../../pages/onboarding/styles";
import { routes } from "../../../navigation";
import { ModeScroller } from "../mode-scroller/mode-scroller";
import { breakpoints, color } from "../../../design";
import { useIsMobile } from "../../../hooks";
import { NotificationWrapper } from "../../../components/notification-detail/styles";
import { CanvasNotification } from "../canvas-notification/canvas-notification";
import { CanvasItemDetails } from "../canvas-item-details/canvas-item-details";
import { AdjustedItemButtonContainer } from "../item-cards/style";
import { useGetItemSelectionForCharacter } from "../item-cards/hooks";

export const ItemsMode: FC = () => {
  const navigate = useNavigate();
  const {
    selectedAssetCategory,
    selectedAsset,
    showToast,
    setShowToast,
    setSelectedAssetCategory,
    setSelectedAsset,
    setInteractionMode,
    showDetails,
    showWarning,
    setShowWarning,
  } = useCharacterBuilder();
  const [selectedCharacter] = useSelectedCharacter();
  const characterName = selectedCharacter?.nft.name;
  const [items] = useGetItemsInInventoryByCategory(selectedAssetCategory);

  const isMobile = useIsMobile(breakpoints.tablet);
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
  const [equippedItemState, setEquippedItemState] = useState(equipped.inCategory);
  const equipItem = useEquipItem(setEquippedItemState);
  const unequipItem = useUnequipItem(() => setEquippedItemState(undefined));

  // Always select the equipped item on default
  useEffect(() => {
    if (equippedItem) {
      setSelectedAsset(equippedItem.name);
    }
  }, [equippedItem]);

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
      <FadeInOut show={showWarning} exiting={!showWarning}>
        {showWarning && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showWarning}>
          <CanvasNotification
            isError
            title={"Oops..you have not equipped your item!"}
            info={""}
            closeToast={() => {
              setShowWarning(false);
            }}
          >
            <SecondaryButton
              onClick={() => {
                setSelectedAssetCategory(null);
                setSelectedAsset(null);
                isMobile ? setInteractionMode(MAIN_MODE) : setInteractionMode(CATEGORY_MODE);
                setShowWarning(false);
              }}
            >
              <ButtonText>Continue without equipping</ButtonText>
            </SecondaryButton>
            <PrimaryButton>
              <ButtonText customColor={color.white}>equip</ButtonText>
            </PrimaryButton>
          </CanvasNotification>
        </NotificationWrapper>
      </FadeInOut>
      <CanvasAssetInventoryWrapper>
        <CanvasAssetContainer showDetails={showDetails}>
          {showDetails ? (
            <CanvasItemDetails />
          ) : (
            <>
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
                <CardActionsContainer>
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
                  <SecondaryButton
                    type="submit"
                    onClick={() => {
                      setInteractionMode(MAIN_MODE);
                      navigate(`${routes.shop}/items`);
                    }}
                  >
                    <ButtonText>{text.store.buyMoreAtStore}</ButtonText>
                    <ArrowUpRight />
                  </SecondaryButton>
                </CardActionsContainer>
              </CanvasContentWrapper>
            </>
          )}
        </CanvasAssetContainer>
      </CanvasAssetInventoryWrapper>
    </>
  );
};
