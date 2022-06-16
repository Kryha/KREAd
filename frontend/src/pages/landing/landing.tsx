import { FC, useState } from "react";

import { ExpandIcon, text } from "../../assets";
import { color } from "../../design";
import {
  BaseCharacter,
  BaseRoute,
  ButtonText,
  CharacterCard,
  CharacterItems,
  LoadingPage,
  MenuText,
  SecondaryButton,
  NotificationCard
} from "../../components";
import {
  LandingContainer,
  NotificationWrapper,
  Notification,
  NotificationButton,
  Close,
  Menu,
  BaseWrapper,
  DetailContainer,
  ButtonContainer,
  CharacterCardWrapper
} from "./styles";
import { useMyCharacter, useMyCharacters } from "../../service";
import { ExpandButton } from "../../components/base-character/styles";
import { useViewport } from "../../hooks";
import { CharacterDetailSection } from "../../containers/detail-section/character-detail-section";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";

export const Landing: FC = () => {
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const { data: characters, isLoading: isLoadingCharacters } = useMyCharacters();
  const [openTab, setOpenTab] = useState(false);
  const [openNotification, setOpenNotifications] = useState(false);
  const [hideView, setHideView] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const { width } = useViewport();
  const navigate = useNavigate();

  if (isLoadingCharacter || isLoadingCharacters) return <LoadingPage />;

  // TODO: get an empty page
  if (!character || !characters || !characters.length) return <></>;
  const hideItems = () => {
    setHideView(!hideView);
  };

  const sell = () => {
    if (!character) return;
    navigate(`${routes.sellCharacter}/${character.characterId}`);
  };
  const isZoomed = openTab || openNotification;

  return (
    <BaseWrapper hideView={hideView}>
      <BaseRoute sideNavigation={
        <NotificationWrapper>
          <SecondaryButton onClick={() => setOpenTab(!openTab)} backgroundColor={openTab ? color.lightGrey : color.white}>
            <ButtonText>{text.navigation.myCharacters}</ButtonText>
            {openTab ? <Close /> : <Menu />}
          </SecondaryButton>
          <NotificationButton onClick={() => setOpenNotifications(!openNotification)} backgroundColor={openNotification ? color.lightGrey : color.white}>
            {openNotification ? <Close /> : <Notification />}
          </NotificationButton>
        </NotificationWrapper>
      }
      >
        <LandingContainer isZoomed={isZoomed}>
          <BaseCharacter items={character.items} isZoomed={openTab} size="normal" />
        </LandingContainer>
        {!openTab && !hideView && <CharacterItems items={character.items} />}
        {openTab && <CharacterCard id={character.characterId} characters={characters} />}
        {!hideView && (
          <DetailContainer>
            <MenuText>{character.name}</MenuText>
            <ButtonContainer>
              <SecondaryButton onClick={() => setShowDetail(true)}>
                <ButtonText>{text.general.moreInfo}</ButtonText>
              </SecondaryButton>
              <ButtonText>{text.param.level(character.level)}</ButtonText>
            </ButtonContainer>
          </DetailContainer>
        )}
        {showDetail && (
          <CharacterCardWrapper>
            <CharacterDetailSection
              character={character}
              actions={{ secondary: { text: text.character.sell, onClick: sell }, onClose: () => setShowDetail(false) }}
            />
          </CharacterCardWrapper>
        )}
        {openNotification && <NotificationCard />}
      </BaseRoute>
    </BaseWrapper>
  );
};
