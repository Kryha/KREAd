import Tabs from '@mui/material/Tabs';
import styled from "styled-components";
import { Link } from 'react-router-dom';

import { NavigationTitle } from "../atoms";
import { color, margins } from "../../design";

export const NavTab = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: ${margins.medium};
  font-family: Aktiv Grotesk Medium;
  font-weight: 400;
  font-size: 18px;
  line-height: 20.5px;
  color:${color.black};
  :first-letter {
    text-transform: capitalize;
  }
`;

export const NavTitle = styled(NavigationTitle)`
  padding: 0px 13px 13px 13px;
`;

export const NavTabs = styled(Tabs)`
  && {
    border-bottom: 1px solid ${color.grey};
  }
`;
