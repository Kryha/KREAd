import { Item } from "../../../interfaces";
import { FC, useState } from "react";
import { useIsMobile } from "../../../hooks";
import { breakpoints, color } from "../../../design";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { ButtonText, FadeInOut, Img, NotificationDetail, Overlay, PrimaryButton, SecondaryButton } from "../../../components";
import { ToastActions } from "../canvas-notification/styles";
import { NotificationItemCardContainer, NotificationWrapper } from "../../../components/notification-detail/styles";
import { text } from "../../../assets";
import { CanvasNotification } from "../canvas-notification/canvas-notification";
import { ItemImageCard } from "../item-cards/style";
import { ItemCardInfo } from "../item-cards/item-card-info";
import { CATEGORY_MODE, MAIN_MODE } from "../../../constants";

interface Props {
  selected: Item | undefined;
  equip: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export const ItemNotifications: FC<Props> = ({ selected, equip }) => {
  const isMobile = useIsMobile(breakpoints.tablet);
  const { showToast, setShowToast, setSelectedAssetCategory, setSelectedAsset, setInteractionMode, showWarning, setShowWarning } =
    useCharacterBuilder();
  const [showUnequipFirst, setShowUnequipFirst] = useState(false);
  return (
    <>
      <FadeInOut show={showToast} exiting={!showToast}>
        {showToast && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showToast}>
          <NotificationDetail
            title={text.general.goToYourWallet}
            info={text.general.yourActionIsPending}
            closeToast={() => setShowToast(false)}
            isError
          />
        </NotificationWrapper>
      </FadeInOut>
      <FadeInOut show={showWarning} exiting={!showWarning}>
        {showWarning && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showWarning}>
          <CanvasNotification
            isError
            title={text.error.youHaveNotEquipped}
            info={""}
            closeToast={() => {
              setShowWarning(false);
              setShowToast(false);
            }}
          >
            {selected && (
              <NotificationItemCardContainer>
                <ItemImageCard>
                  <Img src={selected?.thumbnail} />
                </ItemImageCard>
                <ItemCardInfo item={selected} info={false} />
              </NotificationItemCardContainer>
            )}
            <ToastActions>
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
              <PrimaryButton
                onClick={(event) => {
                  equip(event);
                  setShowWarning(false);
                }}
              >
                <ButtonText customColor={color.white}>equip</ButtonText>
              </PrimaryButton>
            </ToastActions>
          </CanvasNotification>
        </NotificationWrapper>
      </FadeInOut>
      <FadeInOut show={showUnequipFirst} exiting={!showUnequipFirst}>
        {showUnequipFirst && <Overlay isOnTop={true} />}
        <NotificationWrapper showNotification={showUnequipFirst}>
          <CanvasNotification
            isError
            title={text.error.categoryAlreadyEquipped.title(selected?.category)}
            info={text.error.categoryAlreadyEquipped.info(selected?.name, selected?.category)}
            closeToast={() => {
              setShowUnequipFirst(false);
            }}
          ></CanvasNotification>
        </NotificationWrapper>
      </FadeInOut>
    </>
  );
};
