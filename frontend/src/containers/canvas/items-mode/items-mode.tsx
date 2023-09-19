import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { useGetItemsInInventoryByCategory, useSelectedCharacter } from "../../../service";
import { ButtonText, FadeInOut, NotificationDetail, Overlay, PrimaryButton, SecondaryButton } from "../../../components";
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

export const ItemsMode: FC = () => {
  const navigate = useNavigate();
  const {
    selectedAssetCategory,
    setSelectedAssetCategory,
    setSelectedAsset,
    setInteractionMode,
    showDetails,
    showToast,
    setShowToast,
    showWarning,
    setShowWarning,
  } = useCharacterBuilder();
  const [selectedCharacter] = useSelectedCharacter();
  const characterName = selectedCharacter?.nft.name;
  const [items] = useGetItemsInInventoryByCategory(selectedAssetCategory);

  const isMobile = useIsMobile(breakpoints.tablet);

  const equippedItem = items.find((item) => item.equippedTo === characterName);

  // Always select the equipped item on default
  useEffect(() => {
    if (equippedItem) {
      setSelectedAsset(equippedItem.name);
    }
  }, [equippedItem]);

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
      <FadeInOut show={showToast} exiting={!showToast}>
        {showToast && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showToast}>
          <NotificationDetail
            title={text.general.goToYourWallet}
            info={text.general.yourActionIsPending}
            closeToast={() => setShowToast(false)}
          />
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
                <ItemCards />
                <CardActionsContainer>
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
