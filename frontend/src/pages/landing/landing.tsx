import { FC, useState } from "react";

import { text } from "../../assets";
import { color } from "../../design";
import { BaseCharacter, BaseRoute, ButtonText, CharacterCard, CharacterItems, LoadingPage, SecondaryButton } from "../../components";
import { Close, LandingContainer, Menu } from "./styles";
import { useMyCharacter, useMyCharacters } from "../../service";

export const Landing: FC = () => {
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const { data: characters, isLoading: isLoadingCharacters } = useMyCharacters();
  const [openTab, setOpenTab] = useState(false);

  if (isLoadingCharacter || isLoadingCharacters) return <LoadingPage />;

  // TODO: get an empty page
  if (!character || !characters || !characters.length) return <></>;

  return (
    <BaseRoute sideNavigation={
      <SecondaryButton onClick={() => setOpenTab(!openTab)} backgroundColor={openTab ? color.lightGrey : color.white}>
        <ButtonText>{text.navigation.myCharacters}</ButtonText>
        {openTab ? <Close /> : <Menu />}
      </SecondaryButton>}
    >
      <LandingContainer isZoomed={openTab}>
        <BaseCharacter character={character} isZoomed={openTab} size={openTab ? "large" : "normal"} />
      </LandingContainer>
      {Boolean(!openTab) && (
        <CharacterItems items={character.items} />
      )}
      {Boolean(openTab) && (
        <CharacterCard id={character.characterId} characters={characters} />
      )}
    </BaseRoute >
  );
};
