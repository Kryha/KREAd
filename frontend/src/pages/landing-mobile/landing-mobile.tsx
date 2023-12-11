import React, { FC, useState } from "react";
import { text } from "../../assets";
import { CharacterTitle } from './styles'
import {
  BaseRouteMobile,
  BoldLabel,
  ButtonText,
  FadeInOut,
  LevelBoldLabel,
  LoadingPage,
  NotificationDetail,
  Overlay,
  OverviewEmpty,
  PageSubTitle,
  SecondaryButton,
} from "../../components";
import { ButtonContainer, DetailContainer, MarginTop } from "./styles";
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
import { calculateCharacterLevels } from "../../util";
import { AssetTag } from "../../components/asset-card/styles";
import { color } from "../../design";

export const LandingMobile: FC = () => {
  const [selectedCharacter, isLoading] = useSelectedCharacter();
  const [showToast, setShowToast] = useState(false);
  const { width, height } = useViewport();
  const {
    interactionMode,
    setInteractionMode,
  } = useCharacterBuilder();  

  let level = 0;
  if (selectedCharacter) {
    const { totalLevel } = calculateCharacterLevels(selectedCharacter);
    level = totalLevel;
  }

  return (
    <BaseRouteMobile
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
        <MarginTop >
          <OverviewEmpty
            headingText={text.character.youDoNotHave}
            descriptionText={text.character.youDoNotOwnACharacter}
            buttonText={text.character.createANewCharacter}
            redirectRoute={routes.createCharacter}
          />
        </MarginTop>
      ) : (
        <>
          {/* character info */}
          <DetailContainer>
            <CharacterTitle>{selectedCharacter?.nft.name}</CharacterTitle>
            <PageSubTitle>{selectedCharacter?.nft.title}</PageSubTitle>
            <ButtonContainer>
              <AssetTag>
                <BoldLabel customColor={color.black}>lvl. </BoldLabel>
                <LevelBoldLabel customColor={color.black}>{level}</LevelBoldLabel>
              </AssetTag>
            </ButtonContainer>
          </DetailContainer>
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
            {interactionMode === MAIN_MODE && <MainMode items={selectedCharacter.equippedItems} showItems={false} />}
          </Layout>
        </>
      )}
    </BaseRouteMobile>
  );
};
