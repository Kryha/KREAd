import { FC, useState } from "react";

import { ExpandIcon, text } from "../../assets";
import { color } from "../../design";
import { BaseCharacter, BaseRoute, ButtonText, CharacterCard, CharacterItems, LoadingPage, MenuText, SecondaryButton } from "../../components";
import { BaseWrapper, ButtonContainer, CharacterCardWrapper, Close, DetailContainer, LandingContainer, Menu } from "./styles";
import { useMyCharacter, useMyCharacters } from "../../service";
import { ExpandButton } from "../../components/base-character/styles";
import { useViewport } from "../../hooks";
import { CharacterDetailSection } from "../../containers/detail-section/character-detail-section";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation";

export const Landing: FC = () => {
  const { data: character, isLoading: isLoadingCharacter } = useMyCharacter();
  const { data: characters, isLoading: isLoadingCharacters } = useMyCharacters();
  const [openTab, setOpenTab] = useState(false);
  const [hideView, setHideView] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const { width } = useViewport();
  const navigate = useNavigate();

  if (isLoadingCharacter || isLoadingCharacters) return <LoadingPage />;

  // TODO: get an empty page
  if (!character || !characters || !characters.length) return <></>;
  const hideItems = () => {
    setHideView(!hideView);
  };

  const sell = () => {
    if (!character) return;
    navigate(`${routes.sellCharacter}/${character.characterId}`);
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
        {!hideView && (
          <DetailContainer>
            <MenuText>{character.name}</MenuText>
            <ButtonContainer>
              <SecondaryButton onClick={() => setShowDetail(true)}>
                <ButtonText>{text.general.moreInfo}</ButtonText>
              </SecondaryButton>
              <ButtonText>{text.param.level(character.level)}</ButtonText>
            </ButtonContainer>
          </DetailContainer>
        )}
        {showDetail && (
          <CharacterCardWrapper>
            <CharacterDetailSection
              character={character}
              actions={{ secondary: { text: text.character.sell, onClick: sell }, onClose: () => setShowDetail(false) }}
            />
          </CharacterCardWrapper>
        )}
      </BaseRoute>
    </BaseWrapper>
  );
};
