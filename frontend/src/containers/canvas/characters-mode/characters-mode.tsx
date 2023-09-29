import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { ButtonText, PrimaryButton, SecondaryButton } from "../../../components";
import { MAIN_MODE } from "../../../constants";
import { text } from "../../../assets";
import { CanvasAssetContainer, CanvasAssetHeader, CanvasAssetInventoryWrapper, CanvasContentWrapper, CardActionsContainer } from "../style";
import { ArrowUpRight } from "../../../pages/onboarding/styles";
import { routes } from "../../../navigation";
import { ModeScroller } from "../mode-scroller/mode-scroller";
import { color } from "../../../design";
import { ArrowUp } from "../../../components/character-card/styles";
import { ButtonInfo } from "../../../components/button-info";
import { CharacterCards } from "../character-cards/character-cards";
import { CharacterActions } from "./styles";
import { CanvasCharacterDetails } from "../canvas-character-details/canvas-character-details";

export const CharactersMode: FC = () => {
  const navigate = useNavigate();
  const { setInteractionMode, showDetails, showWarning } = useCharacterBuilder();

  const [, setShowToast] = useState(false);

  useEffect(() => {
    if (showWarning) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [showWarning]);

  return (
    <>
      <CanvasAssetInventoryWrapper>
        <CanvasAssetContainer showDetails={showDetails}>
          {showDetails ? (
            <CanvasCharacterDetails />
          ) : (
            <>
              <CanvasAssetHeader>
                <ModeScroller />
              </CanvasAssetHeader>
              <CanvasContentWrapper>
                <CharacterCards />
                <CardActionsContainer>
                  <CharacterActions>
                    <ButtonInfo info={text.general.characterCardInfo} infoPosition={"top"} />
                    <PrimaryButton type="submit" onClick={() => navigate(routes.createCharacter)}>
                      <ButtonText customColor={color.white}>{text.general.mintNew}</ButtonText>
                      <ArrowUp />
                    </PrimaryButton>
                  </CharacterActions>
                  <SecondaryButton
                    type="submit"
                    onClick={() => {
                      setInteractionMode(MAIN_MODE);
                      navigate(`${routes.shop}/characters`);
                    }}
                  >
                    <ButtonText>{text.store.buyMoreAtStore}</ButtonText>
                    <ArrowUpRight />
                  </SecondaryButton>
                </CardActionsContainer>
              </CanvasContentWrapper>
            </>
          )}
        </CanvasAssetContainer>
      </CanvasAssetInventoryWrapper>
    </>
  );
};
