import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  SecondaryButton,
  OverviewEmpty,
} from "../../components";
import { Close, LandingContainer, Menu, DetailContainer, ButtonContainer, CharacterCardWrapper } from "./styles";
import { CharacterDetailSection } from "../../containers/detail-section";
import { useSelectedCharacter } from "../../service";
import { routes } from "../../navigation";

export const Landing: FC = () => {
  const navigate = useNavigate();

  const [openTab, setOpenTab] = useState(false);
  const [selectedCharacter, isLoading] = useSelectedCharacter();
  const [showDetail, setShowDetail] = useState(false);
  const [closeDetail, setCloseDetail] = useState(false);

  const sell = (characterId: string) => {
    navigate(`${routes.sellCharacter}/${characterId}`);
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
      {isLoading ? (
        <LoadingPage />
      ) : !selectedCharacter ? (
        // TODO: abstract internal component so we don't end up in this conditional madness
        <OverviewEmpty
          headingText={text.character.youDoNotHave}
          descriptionText={text.character.youDoNotOwnACharacter}
          buttonText={text.character.createANewCharacter}
          redirectRoute={routes.createCharacter}
        />
      ) : (
        <>
          {/* character big picture */}
          <LandingContainer isZoomed={!openTab}>
            <BaseCharacter
              characterImage={selectedCharacter.nft.image}
              items={selectedCharacter.equippedItems}
              isZoomed={openTab}
              size="normal"
            />
          </LandingContainer>

          {/* equipped items under character */}
          <CharacterItems items={selectedCharacter.equippedItems} showItems={!openTab} />

          {/* character info */}
          {!openTab && (
            <DetailContainer>
              <MenuText>{selectedCharacter?.nft.name}</MenuText>
              <ButtonContainer>
                <SecondaryButton onClick={() => setShowDetail(true)}>
                  <ButtonText>{text.general.moreInfo}</ButtonText>
                </SecondaryButton>
                <ButtonText>{text.param.level(selectedCharacter?.nft.level)}</ButtonText>
              </ButtonContainer>
            </DetailContainer>
          )}
          <CharacterCardWrapper>
            <FadeInOut show={showDetail} exiting={closeDetail}>
              <CharacterDetailSection
                nft={selectedCharacter.nft}
                equippedItems={selectedCharacter.equippedItems}
                actions={{
                  secondary: { text: text.character.sell, onClick: () => sell(selectedCharacter.nft.id) },
                  onClose: () => {
                    setShowDetail(false);
                    setCloseDetail(true);
                  },
                }}
              />
            </FadeInOut>
          </CharacterCardWrapper>

          <FadeInOut show={showDetail} exiting={closeDetail}>
            <Overlay />
          </FadeInOut>

          {/* my characters list */}
          <CharacterCard id={selectedCharacter.nft.id} showCard={openTab} />
        </>
      )}
    </BaseRoute>
  );
};
