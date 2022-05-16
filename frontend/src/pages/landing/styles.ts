import styled from "styled-components";
import { BaseCharacterIcon } from "../../assets";
import { SecondaryButton } from "../../components";

interface ImageProps {
  width: number;
  height: number;
}
export const ExpandButton = styled(SecondaryButton)`;
  position: absolute;
  z-index: 10;
  left: 45%;
  bottom: 40px;
`;

export const BaseCharacter = styled(BaseCharacterIcon) <ImageProps>`
  position: absolute;
  left: 30%;
  top: -13px;
  z-index: 1;
  ${({ width, height }): string => `width: ${width * 0.4}px; height: ${height}px;`};
`;
