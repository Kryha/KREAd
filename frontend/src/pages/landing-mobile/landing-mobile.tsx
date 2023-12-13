import React, { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { text } from "../../assets";
import { CharacterTitle } from './styles'
import {
  BaseRouteMobile,
  BoldLabel,
  ButtonText,
  ErrorView,
  FadeInOut,
  LevelBoldLabel,
  LoadingPage,
  NotificationDetail,
  Overlay,
  OverviewEmpty,
  PageSubTitle,
  SecondaryButton,
} from "../../components";
import { ButtonContainer, CharacterCardWrapper, DetailContainer, ItemCardWrapper } from "./styles";
import { CharacterDetailSection, ItemDetailSection } from "../../containers/detail-section";
import { useEquipItem, useGetItemInInventoryByNameAndCategory, useSelectedCharacter, useUnequipItem } from "../../service";
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
import { ButtonInfoWrap } from "../../components/button-info/styles";

export const LandingMobile: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCharacter, isLoading] = useSelectedCharacter();
  const [closeDetail, setCloseDetail] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { width, height } = useViewport();
  const {
    selectedAsset,
    selectedAssetCategory,
    showDetails,
    setShowDetails,
    characterName,
    showItemDetails,
    setShowItemDetails,
    interactionMode,
    setInteractionMode,
  } = useCharacterBuilder();

  const [item] = useGetItemInInventoryByNameAndCategory(selectedAsset, selectedAssetCategory, characterName);

  const equipItem = useEquipItem();
  const unequipItem = useUnequipItem();

  if (equipItem.isError || unequipItem.isError) return <ErrorView />;
  const equipAsset = () => {
    setShowToast(!showToast);
    if (item) {
      equipItem.mutate({ item, callback: {} });
    }
  };

  const unequipAsset = () => {
    setShowToast(!showToast);
    if (item) {
      unequipItem.mutate({ item, callback: {} });
    }
  };

  const sell = (characterId: number) => {
    navigate(`${routes.sellCharacter}/${characterId}`, { state: location });
  };

  const sellAsset = () => {
    navigate(`${routes.sellItem}/${item?.category}/${item?.name}`, {
      state: location,
    });
  };

  const assetDetailActions = () => {
    if (item?.equippedTo !== "") {
      return { primary: { text: text.item.unequip, onClick: unequipAsset } };
    } else {
      return {
        primary: { text: text.item.equip, onClick: equipAsset },
        secondary: { text: text.item.sell, onClick: sellAsset },
      };
    }
  };

  const displayToast = () => {
    setShowToast(true);
  };

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
        <OverviewEmpty
          headingText={text.character.youDoNotHave}
          descriptionText={text.character.youDoNotOwnACharacter}
          buttonText={text.character.createANewCharacter}
          redirectRoute={routes.createCharacter}
        />
      ) : (
        <>
          {/* character info */}
          {interactionMode === MAIN_MODE ? (
            <DetailContainer>
              <CharacterTitle>{selectedCharacter?.nft.name}</CharacterTitle>
              <PageSubTitle>{selectedCharacter?.nft.title}</PageSubTitle>
              <ButtonContainer>
                <ButtonInfoWrap onClick={() => setShowDetails(true)}>
                  <SecondaryButton>{text.general.info}</SecondaryButton>
                </ButtonInfoWrap>
                <AssetTag>
                  <BoldLabel customColor={color.black}>lvl. </BoldLabel>
                  <LevelBoldLabel customColor={color.black}>{level}</LevelBoldLabel>
                </AssetTag>
              </ButtonContainer>
            </DetailContainer>
          ) : (
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
          )}

          <ItemCardWrapper>
            {showItemDetails && (
              <ItemDetailSection
                item={item}
                actions={{
                  onClose: () => {
                    setShowItemDetails(false);
                  },
                  primary: assetDetailActions()?.primary,
                  secondary: assetDetailActions()?.secondary,
                }}
              />
            )}
          </ItemCardWrapper>
          <CharacterCardWrapper>
            {interactionMode !== ITEM_MODE && (
              <FadeInOut show={showDetails} exiting={closeDetail}>
                <CharacterDetailSection
                  character={selectedCharacter}
                  actions={{
                    secondary: {
                      text: text.character.sell,
                      onClick: () => sell(Number(selectedCharacter.nft.id)),
                    },
                    onClose: () => {
                      setShowDetails(false);
                      setCloseDetail(true);
                    },
                  }}
                  showToast={displayToast}
                />
              </FadeInOut>
            )}
          </CharacterCardWrapper>

          <FadeInOut show={showDetails} exiting={closeDetail}>
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
            {interactionMode === MAIN_MODE && <MainMode items={selectedCharacter.equippedItems} showItems={false} />}
          </Layout>
        </>
      )}
    </BaseRouteMobile>
  );
};
