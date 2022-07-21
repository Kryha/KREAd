import { FC, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { text } from "../../assets";
import { color } from "../../design";
import {
  BaseCharacter,
  BaseRoute,
  ButtonText,
  CharacterCard,
  CharacterItems,
  ErrorView,
  FadeInOut,
  LoadingPage,
  MenuText,
  NotificationCard,
  Overlay,
  SecondaryButton,
} from "../../components";
import {
  Close,
  LandingContainer,
  Menu,
  NotificationButton,
  NotificationWrapper,
  Notification,
  DetailContainer,
  ButtonContainer,
  CharacterCardWrapper,
  NotificationContainer,
  Tag,
} from "./styles";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useSelectedCharacter } from "../../service";
import { routes } from "../../navigation";

export const Landing: FC = () => {
  const navigate = useNavigate();

  const [openTab, setOpenTab] = useState(false);
  const [openNotification, setOpenNotifications] = useState(false);
  const [selectedCharacter, isLoading] = useSelectedCharacter();
  const [showDetail, setShowDetail] = useState(false);
  const [closeDetail, setCloseDetail] = useState(false);

  // TODO: get an empty page
  if (!selectedCharacter) return <ErrorView />;

  const sell = (characterId: string) => {
    navigate(`${routes.sellCharacter}/${characterId}`);
  };

  return (
    <BaseRoute
      isLanding
      sideNavigation={
        <NotificationWrapper>
          <SecondaryButton onClick={() => setOpenTab(!openTab)} backgroundColor={openTab ? color.lightGrey : color.white}>
            <ButtonText>{text.navigation.myCharacters}</ButtonText>
            {openTab ? <Close /> : <Menu />}
          </SecondaryButton>
          <NotificationContainer>
            <NotificationButton
              open={openNotification}
              onClick={() => setOpenNotifications(!openNotification)}
              backgroundColor={openNotification ? color.lightGrey : color.white}
            >
              {openNotification ? <Close /> : <Notification />}
            </NotificationButton>
            <Tag />
          </NotificationContainer>
        </NotificationWrapper>
      }
    >
      {isLoading ? (
        <LoadingPage />
      ) : !selectedCharacter ? (
        // TODO: abstract internal component so we don't end up in this conditional madness
        <Navigate to={routes.root} />
      ) : (
        <>
          {/* character big picture */}
          <LandingContainer isZoomed={!openTab && !openNotification}>
            <BaseCharacter items={selectedCharacter.items} isZoomed={openTab} size="normal" />
          </LandingContainer>

          {/* equipped items under character */}
          <CharacterItems items={selectedCharacter.items} showItems={!openTab && !openNotification} />

          {/* character info */}
          <DetailContainer>
            <MenuText>{selectedCharacter?.name}</MenuText>
            <ButtonContainer>
              <SecondaryButton onClick={() => setShowDetail(true)}>
                <ButtonText>{text.general.moreInfo}</ButtonText>
              </SecondaryButton>
              <ButtonText>{text.param.level(selectedCharacter?.level)}</ButtonText>
            </ButtonContainer>
          </DetailContainer>
          <CharacterCardWrapper>
            <FadeInOut show={showDetail} exiting={closeDetail}>
              <CharacterDetailSection
                character={selectedCharacter}
                actions={{
                  secondary: { text: text.character.sell, onClick: () => sell(selectedCharacter.id) },
                  onClose: () => {
                    setShowDetail(false);
                    setCloseDetail(true);
                  },
                }}
              />
            </FadeInOut>
          </CharacterCardWrapper>

          {/* notifications */}
          {openNotification && (
            <>
              <NotificationCard />
              <Overlay />
            </>
          )}
          <FadeInOut show={showDetail} exiting={closeDetail}>
            <Overlay />
          </FadeInOut>

          {/* my characters list */}
          <CharacterCard id={selectedCharacter.id} showCard={openTab} />
        </>
      )}
    </BaseRoute>
  );
};
