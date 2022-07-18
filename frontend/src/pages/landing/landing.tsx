import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { useMyCharacters } from "../../service";
import { routes } from "../../navigation";
import { Character } from "../../interfaces";

export const Landing: FC = () => {
  const navigate = useNavigate();
  const [{ owned: myCharacters, isLoading: isLoadingCharacters }] = useMyCharacters();
  const [openTab, setOpenTab] = useState(false);
  const [openNotification, setOpenNotifications] = useState(false);
  const [_selectedCharacter, setSelectedCharacter] = useState<Character>();
  const [showDetail, setShowDetail] = useState(false);
  const [closeDetail, setCloseDetail] = useState(false);

  useEffect(() => {
    myCharacters[0] && setSelectedCharacter(myCharacters[0]);
  }, [myCharacters, isLoadingCharacters]);

  // TODO: get an empty page
  // if (!_selectedCharacter) return <ErrorView />;

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
      {isLoadingCharacters || !_selectedCharacter ? (
        <LoadingPage />
      ) : (
        <>
          <LandingContainer isZoomed={!openTab && !openNotification}>
            <BaseCharacter items={_selectedCharacter.items} isZoomed={openTab} size="normal" />
          </LandingContainer>
          <CharacterItems items={_selectedCharacter.items} showItems={!openTab && !openNotification} />
          <DetailContainer>
            <MenuText>{_selectedCharacter?.name}</MenuText>
            <ButtonContainer>
              <SecondaryButton onClick={() => setShowDetail(true)}>
                <ButtonText>{text.general.moreInfo}</ButtonText>
              </SecondaryButton>
              <ButtonText>{text.param.level(_selectedCharacter?.level)}</ButtonText>
            </ButtonContainer>
          </DetailContainer>
          <CharacterCardWrapper>
            <FadeInOut show={showDetail} exiting={closeDetail}>
              <CharacterDetailSection
                character={_selectedCharacter}
                actions={{
                  secondary: { text: text.character.sell, onClick: () => sell(_selectedCharacter.id) },
                  onClose: () => {
                    setShowDetail(false);
                    setCloseDetail(true);
                  },
                }}
              />
            </FadeInOut>
          </CharacterCardWrapper>
          {openNotification && (
            <>
              <NotificationCard />
              <Overlay />
            </>
          )}
          <FadeInOut show={showDetail} exiting={closeDetail}>
            <Overlay />
          </FadeInOut>
          <CharacterCard id={_selectedCharacter.id} characters={myCharacters} showCard={openTab && !!myCharacters} />
        </>
      )}
    </BaseRoute>
  );
};
