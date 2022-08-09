import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

import { NavigationTitle } from "../atoms";
import { color, margins } from "../../design";
import { tabWidth } from "../../util";

export const NavTab = styled(NavLink)`
  text-decoration: none;
`;

export const NavTabs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
`;

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
  padding: 0px 0px ${margins.medium} 0px;
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
