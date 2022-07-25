import { FC, useEffect, useState } from "react";

import { text } from "../../assets";
import { color } from "../../design";
import {
  BaseCharacter,
  BaseRoute,
  ButtonText,
  CharacterCard,
  CharacterItems,
  FadeInOut,
  LoadingPage,
  MenuText,
  Overlay,
  OverviewEmpty,
  SecondaryButton
} from "../../components";
import {
  Close,
  LandingContainer,
  Menu,
  DetailContainer,
  ButtonContainer,
  CharacterCardWrapper,
} from "./styles";
import { useMyCharacter, useMyCharacters } from "../../service";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";

export const Landing: FC = () => {
  const [myCharacters, isLoading] = useMyCharacters();
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const [openTab, setOpenTab] = useState(false);
  const [_selectedCharacter, setSelectedCharacter] = useState(character);
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate();
  const [closeDetail, setCloseDetail] = useState(false);

  useEffect(() => {
    // TODO: remove when when we have handled equiping a character
    myCharacters[0] && setSelectedCharacter(myCharacters[0]);
  }, [myCharacters]);

  if (!character) return (
    <OverviewEmpty
      headingText={text.character.youDoNotHave}
      descriptionText={text.character.youDoNotOwnACharacter}
      buttonText={text.character.createANewCharacter}
      redirectRoute={routes.createCharacter}
    />
  );

  const sell = () => {
    if (!character) return;
    navigate(`${routes.sellCharacter}/${character.characterId}`);
  };

  return (
    <BaseRoute
      isLanding
      sideNavigation={
        <SecondaryButton onClick={() => setOpenTab(!openTab)} backgroundColor={openTab ? color.lightGrey : color.white}>
          <ButtonText>{text.navigation.myCharacters}</ButtonText>
          {openTab ? <Close /> : <Menu />}
        </SecondaryButton>
      }
    >
      {isLoadingCharacter || isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <LandingContainer isZoomed={!openTab}>
            <BaseCharacter items={myCharacters[0].items || character.items} isZoomed={openTab} size="normal" />
          </LandingContainer>
          <CharacterItems items={myCharacters[0].items || character.items} showItems={!openTab} />
          <DetailContainer>
            <MenuText>{myCharacters[0].name || character.name}</MenuText>
            <ButtonContainer>
              <SecondaryButton onClick={() => setShowDetail(true)}>
                <ButtonText>{text.general.moreInfo}</ButtonText>
              </SecondaryButton>
              <ButtonText>{text.param.level(myCharacters[0].level || character.level)}</ButtonText>
            </ButtonContainer>
          </DetailContainer>
          <CharacterCardWrapper>
            <FadeInOut show={showDetail} exiting={closeDetail}>
              <CharacterDetailSection
                character={myCharacters[0] || character}
                actions={{
                  secondary: { text: text.character.sell, onClick: sell },
                  onClose: () => {
                    setShowDetail(false);
                    setCloseDetail(true);
                  },
                }}
              />;
            </FadeInOut>
          </CharacterCardWrapper>
          <FadeInOut show={showDetail} exiting={closeDetail}>
            <Overlay />
          </FadeInOut>
        </>
      )}
      <CharacterCard id={character.characterId} characters={myCharacters} showCard={openTab && !!myCharacters}/>
    </BaseRoute>
  );
};
