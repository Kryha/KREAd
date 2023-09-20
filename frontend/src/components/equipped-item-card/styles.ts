import styled from "@emotion/styled";
import { color } from "../../design";
import { Id } from "../vertical-info/styles";

interface DirectionProps {
  isRight: boolean;
  isSecond?: boolean;
}

export const EquippedContainer = styled.div<DirectionProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  &:hover {
    ${Id} {
      color: ${color.black};
    }
  }
`;
