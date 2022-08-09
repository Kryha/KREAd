import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

import { NavigationTitle } from "../atoms";
import { color, margins } from "../../design";

export const NavTab = styled(NavLink)`
  text-decoration: none;
`;

export const NavTitle = styled(NavigationTitle)`
  padding: 0px ${margins.small} ${margins.small} ${margins.small};
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
export const ActiveLine = styled.div<NavTabProps>`
  ${({ active }) => {
    return active
      ? `
        height: 4px;
        background: ${color.black};
      `
      : `
        height: 3px;
        border-bottom: 1px solid ${color.grey};
    `;
  }}
`;

export const Tab = styled.div<NavTabProps>`
  cursor: pointer;
  ${({ active }) => {
    return active
      ? ""
      : `
      &:hover {
        ${ActiveLine} {
          height: 3px;
          border-bottom: 1px solid ${color.black};
        }
      }
    `;
  }}
`;
