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
import { AirResevoir1, CharacterBase, Clothing1, Empty, Hair7, HeadPiece1, Mask1, text } from "../../assets";

export const OnboardingCharacter: FC = () => {
  const { width, height } = useViewport();

  return (
    <CharacterWrapper>
      <CharacterContainer width={width} height={height}>
        <CharacterIcon width={width} height={height} src={CharacterBase} />
        <FourthIcon src={Hair7 || Empty} alt={text.character.hair} width={width} height={height} />
        <ThirdIcon
          src={HeadPiece1|| Empty}
          alt={text.character.headPiece}
          width={width}
          height={height}
        />
        <SecondIcon src={Mask1 || Empty} alt={text.character.mask} width={width} height={height} />
        <FifthIcon
          src={AirResevoir1 || Empty}
          alt={text.character.airResevoir}
          width={width}
          height={height}
        />
        <FirstIcon
          src={Clothing1 || Empty}
          alt={text.character.clothing}
          width={width}
          height={height}
        />
      </CharacterContainer>
    </CharacterWrapper>
  );
};
