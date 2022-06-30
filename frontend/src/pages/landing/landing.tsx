import { FC, useEffect, useState } from "react";

import { text } from "../../assets";
import { color } from "../../design";
import {
  BaseCharacter,
  BaseRoute,
  ButtonText,
  CharacterCard,
  CharacterItems,
  ErrorView,
  LoadingPage,
  MenuText,
  NotificationCard,
  Overlay,
  SecondaryButton
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
import { useMyCharacter, useMyCharacters } from "../../service";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";

export const Landing: FC = () => {
  const [myCharacters, isLoading] = useMyCharacters();
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const [openTab, setOpenTab] = useState(false);
  const [openNotification, setOpenNotifications] = useState(false);
  const[selectedCharacter, setSelectedCharacter] = useState(character);
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    myCharacters[0] && setSelectedCharacter(myCharacters[0]);
  }, [myCharacters]);

  if (isLoadingCharacter) return <LoadingPage />;
  // TODO: get an empty page
  if (!character) return <ErrorView />;

  // TODO: get an empty page
  if (!character) return <></>;

  const sell = () => {
    if (!character) return;
    navigate(`${routes.sellCharacter}/${character.characterId}`);
  };

  return (
    <BaseRoute
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
      <LandingContainer isZoomed={!openTab && !openNotification}>
        <BaseCharacter items={character.items} isZoomed={openTab} size="normal" />
      </LandingContainer>
      {!openTab && !openNotification && <CharacterItems items={character.items} />}
      {openTab && !!myCharacters && <CharacterCard id={character.characterId} characters={myCharacters} />}
      <DetailContainer>
        <MenuText>{character.name}</MenuText>
        <ButtonContainer>
          <SecondaryButton onClick={() => setShowDetail(true)}>
            <ButtonText>{text.general.moreInfo}</ButtonText>
          </SecondaryButton>
          <ButtonText>{text.param.level(character.level)}</ButtonText>
        </ButtonContainer>
      </DetailContainer>
      {showDetail && (
        <CharacterCardWrapper>
          <CharacterDetailSection
            character={character}
            actions={{ secondary: { text: text.character.sell, onClick: sell }, onClose: () => setShowDetail(false) }}
          />
        </CharacterCardWrapper>
      )}
      {openNotification && (
        <>
          <NotificationCard />
          <Overlay />
        </>
      )}
      {showDetail && <Overlay />}
    </BaseRoute>
  );
};
