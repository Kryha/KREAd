import { FC, useState } from "react";

import { text } from "../../assets";
import { color } from "../../design";
import { BaseCharacter, BaseRoute, ButtonText, CharacterCard, CharacterItems, LoadingPage, SecondaryButton } from "../../components";
import { Close, LandingContainer, Menu } from "./styles";
import { useMyCharacter, useMyCharacters } from "../../service";
import { useCharacterContext } from "../../context/characters";

export const Landing: FC = () => {
  // Use useCharacterContext instead of use My characters
  // const { data: characters, isLoading: isLoadingCharacters } = useMyCharacters();
  const [CharacterState, Dispatch] = useCharacterContext();
  const { characters, fetched } = CharacterState;

  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const [openTab, setOpenTab] = useState(false);

  if (isLoadingCharacter) return <LoadingPage />;

  // TODO: get an empty page
  if (!character || !characters || !characters.length) return <></>;

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
        <BaseCharacter items={character.items} isZoomed={openTab} size={openTab ? "large" : "normal"} />
      </LandingContainer>
      {!openTab && <CharacterItems items={character.items} />}
      {openTab && <CharacterCard id={character.characterId} characters={characters} />}
    </BaseRoute>
  );
};
