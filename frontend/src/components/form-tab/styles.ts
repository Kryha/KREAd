import styled from "@emotion/styled";

import { NavigationTitle } from "../atoms";
import { color } from "../../design";

interface NavTabProps {
  active?: boolean;
}

interface WidthProps {
  width: number;
  amount: number;
  active?: boolean;
}

export const NavTitle = styled(NavigationTitle)<WidthProps>`
  text-align: center;
  ${({ active }) => {
    return active
      ? `
        color: ${color.black}
      `
      : `
        color: ${color.darkGrey};
    `;
  }}
`;

export const ActiveLine = styled.div<NavTabProps>`
  ${({ active }) => {
    return active
      ? `
    height: 4px;
    background: ${color.black}
      `
      : `
      height: 3px;
      border-bottom: 1px solid ${color.grey};
    `;
  }}
`;

export const Tab = styled.div<WidthProps>`
  ${({ width, amount }): string =>
    `width: ${tabWidth(width, amount) / amount}px;`};
`;
