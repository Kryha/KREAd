import { FC, useState } from "react";

import { ExpandIcon, text } from "../../assets";
import { color } from "../../design";
import { BaseCharacter, BaseRoute, ButtonText, CharacterCard, CharacterItems, LoadingPage, SecondaryButton } from "../../components";
import { BaseWrapper, Close, LandingContainer, Menu } from "./styles";
import { useMyCharacter, useMyCharacters } from "../../service";
import { ExpandButton } from "../../components/base-character/styles";
import { useViewport } from "../../hooks";

export const Landing: FC = () => {
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const { data: characters, isLoading: isLoadingCharacters } = useMyCharacters();
  const [openTab, setOpenTab] = useState(false);
  const [hideView, setHideView] = useState(false);
  const { width } = useViewport();

  if (isLoadingCharacter || isLoadingCharacters) return <LoadingPage />;

  // TODO: get an empty page
  if (!character || !characters || !characters.length) return <></>;
  const hideItems = () => {
    setHideView(!hideView);
  };

  return (
    <BaseWrapper hideView={hideView}>
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
          {!openTab && (
            <ExpandButton backgroundColor={color.white} onClick={() => hideItems()} width={width}>
              <ExpandIcon />
              <ButtonText>{text.general.showFull}</ButtonText>
            </ExpandButton>
          )}
        </LandingContainer>
        {!openTab && !hideView && <CharacterItems items={character.items} />}
        {openTab && <CharacterCard id={character.characterId} characters={characters} />}
      </BaseRoute>
    </BaseWrapper>
  );
};
