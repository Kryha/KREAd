import { FC, useState } from "react";

import { text } from "../../assets";
import { color } from "../../design";
import { BaseCharacter, BaseRoute, ButtonText, CharacterCard, CharacterItems, LoadingPage, NotificationCard, SecondaryButton } from "../../components";
import { LandingContainer, NotificationWrapper, Notification, NotificationButton, Close, Menu } from "./styles";
import { useMyCharacter, useMyCharacters } from "../../service";

export const Landing: FC = () => {
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const { data: characters, isLoading: isLoadingCharacters } = useMyCharacters();
  const [openTab, setOpenTab] = useState(false);
  const [openNotification, setOpenNotifications] = useState(false);

  if (isLoadingCharacter || isLoadingCharacters) return <LoadingPage />;

  // TODO: get an empty page
  if (!character || !characters || !characters.length) return <></>;

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
        <BaseCharacter character={character} isZoomed={isZoomed} size={isZoomed ? "large" : "normal"} />
      </LandingContainer>
      {!openTab && (
        <CharacterItems items={character.items} />
      )}
      {openTab && (
        <CharacterCard id={character.characterId} characters={characters} />
      )}
      {Boolean(openNotification) && (
        <NotificationCard />
      )}
    </BaseRoute >
  );
};
