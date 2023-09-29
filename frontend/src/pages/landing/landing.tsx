import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { text } from "../../assets";
import {
  BaseRoute,
  ButtonText,
  FadeInOut,
  LoadingPage,
  MenuText,
  NotificationDetail,
  Overlay,
  OverviewEmpty,
  SecondaryButton,
} from "../../components";
import { ButtonContainer, CharacterCardWrapper, DetailContainer } from "./styles";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useSelectedCharacter } from "../../service";
import { routes } from "../../navigation";
import { NotificationWrapper } from "../../components/notification-detail/styles";
import { Layout } from "../../containers/canvas/character-canvas/styles";
import { CharacterCanvas } from "../../containers/canvas/character-canvas/character-canvas";
import { useViewport } from "../../hooks";
import { useCharacterBuilder } from "../../context/character-builder-context";
import { CategoryMode } from "../../containers/canvas/category-mode/category-mode";
import { CATEGORY_MODE, CHARACTER_SELECT_MODE, ITEM_MODE, MAIN_MODE } from "../../constants";
import { ItemsMode } from "../../containers/canvas/items-mode/items-mode";
import { CharactersMode } from "../../containers/canvas/characters-mode/characters-mode";
import { MainMode } from "../../containers/canvas/main-mode/main-mode";
import { DownloadImageModal } from "../../components/download-image";

export const Landing: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openTab] = useState(false);
  const [selectedCharacter, isLoading] = useSelectedCharacter();
  const [showDetail, setShowDetail] = useState(false);
  const [closeDetail, setCloseDetail] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { width, height } = useViewport();
  const { interactionMode, setInteractionMode } = useCharacterBuilder();
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  
  const sell = (characterId: number) => {
    navigate(`${routes.sellCharacter}/${characterId}`, { state: location });
  };

  const displayToast = () => {
    setShowToast(true);
  };

  //TODO: Add download functionality back
  const handleDownloadButtonClick = () => {
    setIsDownloadOpen(true);
  };

  const handleCloseDownload = () => {
    setIsDownloadOpen(false);
  };

  return (
    <BaseRoute
      isLanding
      sideNavigation={
        <>
          {selectedCharacter ? (
            <SecondaryButton onClick={() => setInteractionMode(CHARACTER_SELECT_MODE)}>
              <ButtonText>{text.navigation.myCharacters}</ButtonText>
            </SecondaryButton>
          ) : (
            <></>
          )}
        </>
      }
    >
      {isLoading ? (
        <LoadingPage spinner={false} />
      ) : !selectedCharacter ? (
        // TODO: abstract internal component so we don't end up in this conditional madness
        <OverviewEmpty
          headingText={text.character.youDoNotHave}
          descriptionText={text.character.youDoNotOwnACharacter}
          buttonText={text.character.createANewCharacter}
          redirectRoute={routes.createCharacter}
        />
      ) : (
        <>
          {/* character info */}
          {!openTab && interactionMode === MAIN_MODE && (
            <DetailContainer>
              <MenuText>{selectedCharacter?.nft.name}</MenuText>
              <ButtonContainer>
                <SecondaryButton onClick={() => setShowDetail(true)}>
                  <ButtonText>{text.general.moreInfo}</ButtonText>
                </SecondaryButton>
                <ButtonText>{text.param.level(selectedCharacter?.nft.level)}</ButtonText>
              </ButtonContainer>
            </DetailContainer>
          )}
          <CharacterCardWrapper>
            <FadeInOut show={showDetail} exiting={closeDetail}>
              <CharacterDetailSection
                character={selectedCharacter}
                actions={{
                  secondary: {
                    text: text.character.sell,
                    onClick: () => sell(Number(selectedCharacter.nft.id)),
                  },
                  onClose: () => {
                    setShowDetail(false);
                    setCloseDetail(true);
                  },
                }}
                showToast={displayToast}
              />
            </FadeInOut>
          </CharacterCardWrapper>

          <FadeInOut show={showDetail} exiting={closeDetail}>
            <Overlay />
          </FadeInOut>
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
          <Layout width={width} height={height}>
            <CharacterCanvas width={width} height={height} />
            {interactionMode === CATEGORY_MODE && <CategoryMode />}
            {interactionMode === ITEM_MODE && <ItemsMode />}
            {interactionMode === CHARACTER_SELECT_MODE && <CharactersMode />}
            {interactionMode === MAIN_MODE && <MainMode items={selectedCharacter.equippedItems} showItems={!!MAIN_MODE} />}
            <DownloadImageModal isOpen={isDownloadOpen} onClose={handleCloseDownload} />
          </Layout>
        </>
      )}
    </BaseRoute>
  );
};
