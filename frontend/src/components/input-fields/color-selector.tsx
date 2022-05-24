import { FC, useState } from "react";
import { text } from "../../assets/text";
import { DetailSectionColorPalette } from "../../containers/detail-section/detail-section-color-palette";
import { ButtonText, PrimaryButton, SecondaryButton } from "../atoms";

import { ButtonContainer, ColorBox, ColorContainer } from "./styles";
// TODO: get actual colors for app

const colors = ["#0000000", "#0000001", "#0000002", "#0000003", "#0000004", "#0000005", "#0000006"];

interface ColorSelectorProps {
  handleChange: (selected: string) => void;
}

export const ColorSelector: FC<ColorSelectorProps> = ({ handleChange }) => {
  const [selected, setSelected] = useState(-1);
  const [color, setColor] = useState("");
  return (
    <ColorBox>
      <ColorContainer>
        {colors.map((color, index) => (
          // TODO: add color component.
          <div key={index} onClick={() => { setSelected(index); setColor(color); }}>
            <DetailSectionColorPalette hexCodeList={colors} />
          </div>
        ))}
      </ColorContainer>
      <ButtonContainer>
        <SecondaryButton onClick={() => { handleChange(""); setSelected(-1); }}><ButtonText>{text.filters.clearFilter}</ButtonText></SecondaryButton>
        <PrimaryButton onClick={() => { handleChange(color); }}><ButtonText>{text.filters.apply}</ButtonText></PrimaryButton>
      </ButtonContainer>
    </ColorBox>
  );
};
