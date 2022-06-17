import { FC, useEffect, useState } from "react";

import { text } from "../../assets";
import { color } from "../../design";
import { BaseCharacter, BaseRoute, ButtonText, CharacterCard, CharacterItems, LoadingPage, SecondaryButton } from "../../components";
import { Close, LandingContainer, Menu } from "./styles";
import { useMyCharacter, useMyCharacters } from "../../service";
import { useCharacterContext } from "../../context/characters";

export const Landing: FC = () => {
  // Use useCharacterContext instead of use My characters
  // const { data: characters, isLoading: isLoadingCharacters } = useMyCharacters();
  const [characterState, dispatch] = useCharacterContext();
  const { fetched } = characterState;
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const [openTab, setOpenTab] = useState(false);
  const[selectedCharacter, setSelectedCharacter] = useState(character);

  useEffect(() => {
    setSelectedCharacter(characterState.owned[0]);
    console.log(characterState);
  }, [characterState]);
  
  if (isLoadingCharacter) return <LoadingPage />;
  // TODO: get an empty page
  // if (!character || !characters || !characters.length) return <></>;

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
        <BaseCharacter items={character!.items} isZoomed={openTab} size={openTab ? "large" : "normal"} />
      </LandingContainer>
      {!openTab && <CharacterItems items={character!.items} />}
      {openTab && characterState.owned && <CharacterCard id={character!.characterId} characters={characterState.owned} />}
    </BaseRoute>
  );
};
