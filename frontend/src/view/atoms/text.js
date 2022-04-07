
import styled from "styled-components";
import { fontWeight } from "../../design";

export const Heading = styled.h1`
  font-size: 52px;
  line-height: 52px;
  white-space: normal;
  word-break: keep-all;
  white-space: pre-wrap;
  font-weight: ${fontWeight.light};
  :first-letter {
    text-transform: capitalize;
  }
`;
