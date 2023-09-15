import styled from "@emotion/styled";
import { color } from "../../design";
import { ElementWrapper } from "../item-card/styles";
import { Id } from "../vertical-info/styles";

interface DirectionProps {
  isRight: boolean;
  isSecond?: boolean;
}

export const EquippedContainer = styled.div<DirectionProps>`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 0px;
  ${({ isRight }): string => {
    return isRight
      ? `
      margin-top: -3px;
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
  ${({ isSecond }): string => {
    return isSecond
      ? `
      margin-top: 2px;
        `
      : "";
  }}
  &: hover {
    ${Id} {
      color: ${color.black};
    }
  }
`;
