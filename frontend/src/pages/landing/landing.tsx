import { FC, useState } from "react";

import { ExpandIcon, text } from "../../assets";
import { color } from "../../design";
import { BaseCharacter, BaseRoute, ButtonText, CharacterCard, CharacterItems, LoadingPage, NotificationCard, SecondaryButton } from "../../components";
import { LandingContainer, NotificationWrapper, Notification, NotificationButton, Close, Menu } from "./styles";
import { useMyCharacter, useMyCharacters } from "../../service";
import { ExpandButton } from "../../components/base-character/styles";
import { useViewport } from "../../hooks";

export const Landing: FC = () => {
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const { data: characters, isLoading: isLoadingCharacters } = useMyCharacters();
  const [openTab, setOpenTab] = useState(false);
  const [openNotification, setOpenNotifications] = useState(false);
  const [hideView, setHideView] = useState(false);
  const { width } = useViewport();

  if (isLoadingCharacter || isLoadingCharacters) return <LoadingPage />;

  // TODO: get an empty page
  if (!character || !characters || !characters.length) return <></>;
  const hideItems = () => {
    setHideView(!hideView);
  };

  const isZoomed = openTab || openNotification;

  return (
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
        {!openTab && (
          <ExpandButton backgroundColor={color.white} onClick={() => hideItems()} width={width}>
            <ExpandIcon />
            <ButtonText>{text.general.showFull}</ButtonText>
          </ExpandButton>
        )}
      </LandingContainer>
      {!openTab && <CharacterItems items={character.items} />}
      {openTab && <CharacterCard id={character.characterId} characters={characters} />}
      {openNotification && <NotificationCard />}
    </BaseRoute>
  );
};
