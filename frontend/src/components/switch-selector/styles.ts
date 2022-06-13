import styled from "@emotion/styled";

import { color, margins } from "../../design";
import { SecondaryButton, PrimaryButton } from "../atoms";

interface ButtonProps {
  selected: boolean;
}

export const SwitchButtonLeft = styled(PrimaryButton)<ButtonProps>`
  border-radius: ${margins.medium} 0px 0px ${margins.medium};
  text-transform: capitalize;
  padding: 7px 35px;
  color: ${color.white};
  :hover {
    color: ${color.black};
    padding: 7px 35px;
  }
  ${({ selected }): string => {
    return selected
      ? `
       color: ${color.black};
       background-color: ${color.white};
       border: 1px solid ${color.grey};
       padding: 8px 35px;
        `
      : `
      `;
  }};
`;

export const SwitchButtonRight = styled(SecondaryButton)<ButtonProps>`
  border-radius: 0px ${margins.medium} ${margins.medium} 0px;
  padding: 8px 35px;
  text-transform: capitalize;
  :hover {
    color: ${color.black};
  }
  :focus {
    padding: 7px 35px;
  }
  ${({ selected }): string => {
    return selected
      ? `
        background: ${color.black};
        color: ${color.white};
        padding: 8px 35px;
        border: 1px solid ${color.black};
        `
      : `

      `;
  }};
`;

export const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
`;
