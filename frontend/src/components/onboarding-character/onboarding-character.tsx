import { FC } from "react";

import {
  CharacterContainer,
  CharacterIcon,
  CharacterWrapper,
  FirstIcon,
  SecondIcon,
  ThirdIcon,
  FourthIcon,
  FifthIcon,
} from "./styles";
import { useViewport } from "../../hooks";
import {  Empty, TempetAddons, TempetCharacter, TempetClothing, TempetHair, TempetHeadpiece, TempetMask, text } from "../../assets";
import { zIndex } from "../../design";

export const OnboardingCharacter: FC = () => {
  const { width, height } = useViewport();

  return (
    <CharacterWrapper>
      <CharacterContainer width={width} height={height}>
        <CharacterIcon width={width} height={height} src={TempetCharacter} zIndex={zIndex.character} />
        <FourthIcon
          src={TempetHair || Empty}
          alt={text.character.hair}
          width={width}
          height={height}
          zIndex={zIndex.hair}
        />
        <ThirdIcon
          src={TempetHeadpiece|| Empty}
          alt={text.character.headPiece}
          width={width}
          height={height}
          zIndex={zIndex.headPiece}
        />
        <SecondIcon
          src={TempetMask || Empty}
          alt={text.character.mask}
          width={width}
          height={height}
          zIndex={zIndex.mask}
        />
        <FifthIcon
          src={TempetAddons || Empty}
          alt={text.character.addOns}
          width={width}
          height={height}
          zIndex={zIndex.addOns}
        />
        <FirstIcon
          src={TempetClothing || Empty}
          alt={text.character.clothing}
          width={width}
          height={height}
          zIndex={zIndex.clothing}
        />
      </CharacterContainer>
    </CharacterWrapper>
  );
};
