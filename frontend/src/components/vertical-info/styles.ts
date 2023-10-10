import styled from "@emotion/styled";
import { color, fontWeight } from "../../design";

interface DirectionProps {
  isRight: boolean;
  category: string;
}

export const Id = styled.h3<DirectionProps>`
  :first-letter {
    text-transform: capitalize;
  }
  font-weight: ${fontWeight.medium};
  font-size: 14px;
  white-space: nowrap;
  color: ${color.darkGrey};
`;

export const InfoContainer = styled.div`
  cursor: pointer;
`;
