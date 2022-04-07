
import styled from "styled-components";
import { color, fontWeight } from "../../design";

interface TextProps {
  customColor?: string;
}

export const Heading = styled.h1<TextProps>`
  font-size: 52px;
  line-height: 52px;
  white-space: normal;
  word-break: keep-all;
  white-space: pre-wrap;
  font-weight: ${fontWeight.light};
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};
`;
