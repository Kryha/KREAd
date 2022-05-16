import { FC, useState } from "react";

import { CloseIcon, MenuIcon, text } from "../../assets";
import { color } from "../../design";
import { BaseCharacter, BaseRoute, CharacterItems, LoadingPage, SecondaryButton } from "../../components";
import { LandingContainer } from "./styles";
import { useMyCharacter } from "../../service";

export const Landing: FC = () => {
  const [openTab, setOpenTab] = useState(false);
  const { data: character, isLoading } = useMyCharacter();

  if (isLoading) return <LoadingPage />;

  // TODO: get an empty page
  if (!character) return <></>;

  return (
    <BaseRoute sideNavigation={
      <SecondaryButton onClick={() => setOpenTab(!openTab)} backgroundColor={openTab ? color.lightGrey : color.white}>
        {text.navigation.myCharacters}
        {openTab ? <CloseIcon /> : <MenuIcon />}
      </SecondaryButton>}
    >
      <LandingContainer isZoomed={openTab}>
        <BaseCharacter character={character} isZoomed={openTab} size={openTab ? "large" : "normal"} />
      </LandingContainer>

      {Boolean(!openTab) && (
        <CharacterItems items={character.items} />
      )}
    </BaseRoute >
  );
};
