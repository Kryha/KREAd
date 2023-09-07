import { FC, useState } from "react";
import { text } from "../../assets";
import { DetailSectionColorPalette } from "../../containers/detail-section/detail-section-color-palette";
import { ButtonText, PrimaryButton, SecondaryButton } from "../atoms";
import { color as designColors } from "../../design";

import {
  ButtonContainer,
  ColorBox,
  ColorContainer,
  ColorWrapper,
} from "./styles";
import { useViewport } from "../../hooks";
import { COLORS } from "../../constants";

// TODO: get actual colors for app

interface ColorSelectorProps {
  handleChange: (selected: string) => void;
}

export const ColorSelector: FC<ColorSelectorProps> = ({
  handleChange,
  colors,
}) => {
  const [selected, setSelected] = useState(-1);
  const [color, setColor] = useState("");
  const { height } = useViewport();

  return (
    <ColorBox height={height}>
      <ColorContainer>
        {colors.map((color, index) => (
          <ColorWrapper
            key={index}
            onClick={() => {
              setSelected(index);
              setColor(color);
            }}
            selected={selected === index}
          >
            <DetailSectionColorPalette hexCodeList={[color]} />
          </ColorWrapper>
        ))}
      </ColorContainer>
      <ButtonContainer>
        <SecondaryButton
          onClick={() => {
            handleChange("");
            setSelected(-1);
          }}
        >
          <ButtonText>{text.filters.clearFilter}</ButtonText>
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {
            handleChange(color);
          }}
        >
          <ButtonText customColor={designColors.white}>
            {text.filters.apply}
          </ButtonText>
        </PrimaryButton>
      </ButtonContainer>
    </ColorBox>
  );
};
