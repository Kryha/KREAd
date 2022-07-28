import { FC, useEffect, useState } from "react";

import { CharacterContainer, CharacterIcon, CharacterWrapper, FirstIcon, SecondIcon, ThirdIcon, FourthIcon, FifthIcon } from "./styles";
import { useViewport } from "../../hooks";
import { Empty, TempetAddons, TempetFrontMask2, TempetCharacter, TempetClothing, TempetClothing2, TempetHair, TempetHair2, TempetHeadpiece, TempetHeadpiece2, TempetMask, TempetMask2, text } from "../../assets";
import { zIndex } from "../../design";

const hairImages = [TempetHair, TempetHair2];
const headPieceImages = [TempetHeadpiece, TempetHeadpiece2];
const maskImages = [TempetMask, TempetMask2];
const addOnsImages = [TempetAddons, TempetFrontMask2];
const clothingImages = [TempetClothing, TempetClothing2];

export const OnboardingCharacter: FC = () => {
  const { width, height } = useViewport();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * (2)) + 0);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <CharacterWrapper>
      <CharacterContainer width={width} height={height}>
        <CharacterIcon width={width} height={height} src={TempetCharacter} />
        <FourthIcon src={hairImages[currentIndex] || Empty} alt={text.character.hair} width={width} height={height} zIndex={zIndex.hair} />
        <ThirdIcon src={headPieceImages[currentIndex] || Empty} alt={text.character.headPiece} width={width} height={height} zIndex={zIndex.headPiece} />
        <SecondIcon src={maskImages[currentIndex]|| Empty} alt={text.character.mask} width={width} height={height} zIndex={zIndex.mask} />
        <FifthIcon src={addOnsImages[currentIndex] || Empty} alt={text.character.frontMask} width={width} height={height} zIndex={zIndex.frontMask} />
        <FirstIcon src={clothingImages[currentIndex] || Empty} alt={text.character.clothing} width={width} height={height} zIndex={zIndex.clothing} />
      </CharacterContainer>
    </CharacterWrapper>
  );
};
