import Tabs from '@mui/material/Tabs';
import styled from "styled-components";
import { Link } from 'react-router-dom';

import { NavigationTitle } from "../atoms";

export const NavTab = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 16px;
  font-family: Aktiv Grotesk Medium;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #141414;
`;

export const NavTitle = styled(NavigationTitle)`
  padding: 0px 13px 13px 13px;
  && {
      ::first-letter {
    text-transform: capitalize;
  };
  }
`;

export const NavTabs = styled(Tabs)`
  && {
    border-bottom: 1px solid #D0D0D0;
  }
`;
