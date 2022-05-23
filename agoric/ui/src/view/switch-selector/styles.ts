import styled from "styled-components";
// import Button from '@mui/material/Button';

import { color, margins } from "../../design";

//TODO: re-visit based on @mui/material/Button

export const SwitchButtonLeft = styled.button` // used to be @mui/material/Button
  && {
    font-family: Aktiv Grotesk Medium;
    font-size: 12px;
    line-height: 15px;
    background: ${color.black};
    border: 1px solid ${color.black};
    box-sizing: border-box;
    border-radius: ${margins.medium} 0px 0px ${margins.medium};
    color: ${color.white};
    padding: 9px 35px;
     &:hover {
      background: ${color.black};
      border: 1px solid ${color.black};
      color: ${color.white};
    }
  }
`;

export const SwitchButtonRight = styled.button` // used to be @mui/material/Button
  && {
    font-family: Aktiv Grotesk Medium;
    font-size: 12px;
    line-height: 15px;
    background: ${color.white};
    border: 1px solid ${color.grey};
    box-sizing: border-box;
    border-radius: 0px ${margins.medium} ${margins.medium} 0px;
    color: ${color.black};
    padding: 9px 35px;
    &:hover {
      background: ${color.white};
      border: 1px solid ${color.grey};
      color: ${color.black};
    }
  }
`;
