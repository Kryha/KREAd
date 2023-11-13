import React, { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCharacterBuilder } from "../../../context/character-builder-context";
import { ButtonText, HorizontalDivider, PrimaryButton, SecondaryButton } from "../../../components";
import { MAIN_MODE, MINTING_COST, MONEY_DECIMALS } from "../../../constants";
import { StoreIcon, text } from "../../../assets";
import {
  CanvasAssetContainer,
  CanvasAssetHeader,
  CanvasAssetInventoryWrapper,
  CanvasContentWrapper,
  CardActionsContainer,
  Store,
} from "../style";
import { routes } from "../../../navigation";
import { ModeScroller } from "../mode-scroller/mode-scroller";
import { color } from "../../../design";
import { CharacterCards } from "../character-cards/character-cards";
import { CharacterActions } from "./styles";
import { ExtendedCharacter } from "../../../interfaces";
import { useMyCharacters } from "../../../service";
import { ISTButton, ISTButtonIcon } from "../../../components/asset-card/styles";

export const CharactersMode: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedAsset, setInteractionMode, showWarning } = useCharacterBuilder();
  const [characters] = useMyCharacters();

  const selectedCharacter = characters.find((character) => character.nft.name === selectedAsset);
  const [, setShowToast] = useState(false);

  useEffect(() => {
    if (showWarning) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [showWarning]);

  const sell = (character: ExtendedCharacter | undefined) => {
    if (!character) return;
    navigate(`${routes.sellCharacter}/${character.nft.id}`, {
      state: location,
    });
  };
  const characterMintPrice = MINTING_COST / Number("1".padEnd(MONEY_DECIMALS + 1, "0"));

  return (
    <>
      <CanvasAssetInventoryWrapper>
        <CanvasAssetContainer>
          <CanvasAssetHeader>
            <ModeScroller />
          </CanvasAssetHeader>
          <CanvasContentWrapper>
            <CharacterCards />
            <HorizontalDivider />
            <CardActionsContainer>
              <CharacterActions>
                <PrimaryButton type="submit" onClick={() => navigate(routes.createCharacter)}>
                  <ButtonText customColor={color.white}>{text.general.mintNew}</ButtonText>
                  <ISTButton>
                    <ISTButtonIcon />
                    {characterMintPrice}
                  </ISTButton>
                </PrimaryButton>
              </CharacterActions>
              <PrimaryButton onClick={() => sell(selectedCharacter)}>
                <ButtonText customColor={color.white}>sell</ButtonText>
              </PrimaryButton>
              <Store>
                <SecondaryButton
                  type="submit"
                  onClick={() => {
                    setInteractionMode(MAIN_MODE);
                    navigate(`${routes.shop}/characters`);
                  }}
                >
                  <StoreIcon />
                </SecondaryButton>
              </Store>
            </CardActionsContainer>
          </CanvasContentWrapper>
        </CanvasAssetContainer>
      </CanvasAssetInventoryWrapper>
    </>
  );
};
