import styled from "@emotion/styled";
import { color } from "../../design";
import { ElementWrapper } from "../item-card/styles";
import { Id } from "../vertical-info/styles";

interface DirectionProps {
  isRight: boolean;
}

export const EquippedContainer = styled.div<DirectionProps>`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 0px;
  ${({ isRight }): string => {
    return isRight
      ? `
      ${ElementWrapper} {
        margin-right: 8px;
        margin-left: 24px;
      }
        `
      : `
      ${ElementWrapper} {
        margin-right: 24px;
      }
      `;
  }}
  &: hover{
    ${Id} {
      color: ${color.black};
    }
  }
`;
