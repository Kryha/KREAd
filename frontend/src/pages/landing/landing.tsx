import { FC, useEffect, useState } from "react";

import { text } from "../../assets";
import { color } from "../../design";
import { BaseCharacter, BaseRoute, ButtonText, CharacterCard, CharacterItems, LoadingPage, SecondaryButton } from "../../components";
import { Close, LandingContainer, Menu } from "./styles";
import { useMyCharacter, useMyCharacters } from "../../service";

export const Landing: FC = () => {
  const [myCharacters, isLoading] = useMyCharacters();
  // const [characterState] = useCharacterContext();

  // TODO: Removed mocked selected character
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const [openTab, setOpenTab] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(character);

  useEffect(() => {
    setSelectedCharacter(myCharacters[0]);
  }, [myCharacters]);

  if (isLoadingCharacter) return <LoadingPage />;
  // TODO: get an empty page
  // if (!character || !myCharacters || !myCharacters.length) return <></>;

  return (
    <BaseRoute
      sideNavigation={
        <SecondaryButton onClick={() => setOpenTab(!openTab)} backgroundColor={openTab ? color.lightGrey : color.white}>
          <ButtonText>{text.navigation.myCharacters}</ButtonText>
          {openTab ? <Close /> : <Menu />}
        </SecondaryButton>
      }
    >
      <LandingContainer isZoomed={openTab}>
        {/* FIXME: do not rely on !*/}
        <BaseCharacter items={character!.items} isZoomed={openTab} size={openTab ? "large" : "normal"} />
      </LandingContainer>
      {!openTab && <CharacterItems items={character!.items} />}
      {openTab && myCharacters && <CharacterCard id={character!.characterId} characters={myCharacters} />}
    </BaseRoute>
  );
};
