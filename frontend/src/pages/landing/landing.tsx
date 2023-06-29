import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { text } from "../../assets";
import { color } from "../../design";
import {
  BaseCharacter,
  BaseRoute,
  ButtonText,
  CharacterCard,
  CharacterItems,
  FadeInOut,
  LoadingPage,
  MenuText,
  NotificationDetail,
  Overlay,
  OverviewEmpty,
  SecondaryButton,
} from "../../components";
import { ButtonContainer, CharacterCardWrapper, Close, DetailContainer, LandingContainer, Menu } from "./styles";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useSelectedCharacter } from "../../service";
import { routes } from "../../navigation";
import { NotificationWrapper } from "../../components/notification-detail/styles";

export const Landing: FC = () => {
  const navigate = useNavigate();

  const [openTab, setOpenTab] = useState(false);
  const [selectedCharacter, isLoading] = useSelectedCharacter();
  const [showDetail, setShowDetail] = useState(false);
  const [closeDetail, setCloseDetail] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const sell = (characterId: string) => {
    navigate(`${routes.sellCharacter}/${characterId}`);
  };

  const displayToast = () => {
    setShowToast(true);
  };

  const displayCharacter = () => {
    navigate(routes.downloadCharacter);
  };

  return (
    <BaseRoute
      isLanding
      sideNavigation={
        <SecondaryButton onClick={() => setOpenTab(!openTab)} backgroundColor={openTab ? color.lightGrey : color.white}>
          <ButtonText>{text.navigation.myCharacters}</ButtonText>
          {openTab ? <Close /> : <Menu />}
        </SecondaryButton>
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
          {/* character big picture */}
          <LandingContainer isZoomed={!openTab}>
            <BaseCharacter
              characterImage={selectedCharacter.nft.image}
              items={selectedCharacter.equippedItems}
              isZoomed={openTab}
              size="normal"
            />
          </LandingContainer>

          {/* equipped items under character */}
          <CharacterItems items={selectedCharacter.equippedItems} showItems={!openTab} />

          {/* character info */}
          {!openTab && (
            <DetailContainer>
              <MenuText>{selectedCharacter?.nft.name}</MenuText>
              <ButtonContainer>
                <SecondaryButton onClick={() => setShowDetail(true)}>
                  <ButtonText>{text.general.moreInfo}</ButtonText>
                </SecondaryButton>
                <ButtonText>{text.param.level(selectedCharacter?.nft.level)}</ButtonText>
              </ButtonContainer>
              <ButtonContainer>
                <SecondaryButton onClick={displayCharacter}>
                  <ButtonText>{text.general.viewCharacter}</ButtonText>
                </SecondaryButton>
              </ButtonContainer>
            </DetailContainer>
          )}
          <CharacterCardWrapper>
            <FadeInOut show={showDetail} exiting={closeDetail}>
              <CharacterDetailSection
                character={selectedCharacter}
                actions={{
                  secondary: { text: text.character.sell, onClick: () => sell(selectedCharacter.nft.id) },
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
          {/* my characters list */}
          <CharacterCard id={selectedCharacter.nft.id} showCard={openTab} />
        </>
      )}
    </BaseRoute>
  );
};
