import { FC, useEffect, useState } from "react";

import { CharacterContainer, CharacterSwitchIcon, FifthIcon, FirstIcon, FourthIcon, ThirdIcon } from "./styles";
import { useViewport } from "../../hooks";
import {
  ArmaCitizen,
  ArmaPerk_I6,
  ArmaPerk_I7,
  ElephiaCitizen,
  Empty,
  Headpiece_Arma_3,
  Headpiece_Arma_5,
  Headpiece_Farma_4,
  Legendary_Garment_Arma_7,
  Mask_Elephia_24,
  Mask_Elephia_32,
  Mask_Mount_3,
  Rare_Garment_Arma_2,
  text,
  Uncommon_Garment_Arma_1,
} from "../../assets";
import { zIndex } from "../../design";

const characterImages = [ArmaCitizen, ElephiaCitizen];
const headPieceImages = [Headpiece_Arma_3, Headpiece_Farma_4, Headpiece_Arma_5, Empty];
const perk1Images = [ArmaPerk_I6, ArmaPerk_I7, Empty];
const maskImages = [Mask_Mount_3, Mask_Elephia_24, Mask_Elephia_32];
const garmentImages = [Legendary_Garment_Arma_7, Rare_Garment_Arma_2, Uncommon_Garment_Arma_1];

export const OnboardingCharacterMobile: FC = () => {
  const { width, height } = useViewport();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * 3.5));
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <CharacterContainer>
      <CharacterSwitchIcon src={characterImages[currentIndex] || ArmaCitizen} />
      <FourthIcon src={perk1Images[currentIndex] || Empty} alt={text.character.perk1} width={width} height={height} zIndex={zIndex.perk1} />
      <ThirdIcon src={headPieceImages[currentIndex] || Empty} alt={text.character.headPiece} zIndex={zIndex.headPiece} />
      <FifthIcon src={maskImages[currentIndex] || Empty} alt={text.character.mask} width={width} height={height} zIndex={zIndex.mask} />
      <FirstIcon src={garmentImages[currentIndex] || Empty} alt={text.character.garment} zIndex={zIndex.garment} />
    </CharacterContainer>
  );
};