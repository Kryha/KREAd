import { FC, useState } from "react";

import { text } from "../../assets";
import { color } from "../../design";
import { BaseCharacter, BaseRoute, ButtonText, CharacterCard, CharacterItems, LoadingPage, SecondaryButton } from "../../components";
import { BaseWrapper, Close, LandingContainer, Menu } from "./styles";
import { useMyCharacter, useMyCharacters } from "../../service";

export const Landing: FC = () => {
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const { data: characters, isLoading: isLoadingCharacters } = useMyCharacters();
  const [openTab, setOpenTab] = useState(false);

  if (isLoadingCharacter || isLoadingCharacters) return <LoadingPage />;

  // TODO: get an empty page
  if (!character || !characters || !characters.length) return <></>;

  return (
    <BaseWrapper>
      <BaseRoute
        sideNavigation={
          <SecondaryButton onClick={() => setOpenTab(!openTab)} backgroundColor={openTab ? color.lightGrey : color.white}>
            <ButtonText>{text.navigation.myCharacters}</ButtonText>
            {openTab ? <Close /> : <Menu />}
          </SecondaryButton>
        }
      >
        <LandingContainer isZoomed={openTab}>
          <BaseCharacter items={character.items} isZoomed={openTab} size="normal" />
        </LandingContainer>
        {!openTab && <CharacterItems items={character.items} />}
        {openTab && <CharacterCard id={character.characterId} characters={characters} />}
      </BaseRoute>
    </BaseWrapper>
  );
};
