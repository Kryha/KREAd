import styled from "@emotion/styled";

import { color, fontSize, margins } from "../../design";
import { SecondaryButton } from "../atoms";

interface ButtonProps {
  selected: boolean;
}

export const SwitchButtonLeft = styled(SecondaryButton)<ButtonProps>`
  border-radius: ${margins.medium} 0px 0px ${margins.medium};
  text-transform: capitalize;
  justify-content: center;
  padding: 8px 16px 8px 16px;
  width: 120px;
  font-size: ${fontSize.subTitle};

  :hover {
    color: ${color.black};
  }
  ${({ selected }): string => {
    return selected
      ? `
      background-color: ${color.black};
      color: ${color.white};
      border: 1px solid ${color.black};
        `
      : `
      `;
  }};
`;

export const SwitchButtonRight = styled(SecondaryButton)<ButtonProps>`
  border-radius: 0 ${margins.medium} ${margins.medium} 0px;
  padding: 8px 16px 8px 16px;
  justify-content: center;
  font-size: ${fontSize.subTitle};
  width: 120px;
  text-transform: capitalize;
  :hover {
    color: ${color.black};
  }
  ${({ selected }): string => {
    return selected
      ? `
        background-color: ${color.black};
        color: ${color.white};
        border: 1px solid ${color.black};
        `
      : `

      `;
  }};
`;

export const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
`;
