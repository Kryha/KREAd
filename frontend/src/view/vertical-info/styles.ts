import styled from "styled-components";
import { color, margins } from "../../design";

import { Label } from "../atoms";

interface DirectionProps {
  isRight: boolean;
}

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 0px ${margins.mini};
  margin: 0px;
`;

export const CategoryCode = styled(Label) <DirectionProps>`

  margin: ${margins.mini} 0px;
  text-transform: uppercase;
  font-family: Aktiv Grotesk Medium;
  flex: none;
  order: 3;
  flex-grow: 0;
  ${({ isRight }): string => {
    return isRight
      ? `
      transform: rotate(90deg);
        `
      : `
      transform: rotate(-90deg);
      `;
  }}
`;

export const Id = styled(CategoryCode) <DirectionProps>`
  margin: ${margins.medium} 0px;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const Dash = styled.div<DirectionProps>`
  width: ${margins.small};
  border: 0.5px solid ${color.darkGrey};
  margin: ${margins.mini} 0px;
  flex: none;
  order: 1;
  flex-grow: 0;
  ${({ isRight }): string => {
    return isRight
      ? `
      transform: rotate(90deg);
        `
      : `
      transform: rotate(-90deg);
      `;
  }}
`;

export const DiagonalContainer = styled.div`
  box-sizing: border-box;
  width: 13px;
  height: 13px;
  border: 1px solid ${color.grey};
  position: relative;
  margin: ${margins.medium} ${margins.small};
`;

export const Diagonal = styled.div`
  border: 1px solid ${color.grey};
  transform: rotate(135deg);
  left: -2px;
  position: absolute;
  width: 14px;
  top: 4.5px;
`;
