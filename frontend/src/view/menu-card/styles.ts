// TODO: replace @mui components

// import { Card, CardActions } from "@mui/material";
import styled from "styled-components";
import { color, margins } from "../../design";
import { HeaderHorizontalDivider } from "../atoms/lines";

export const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${margins.mini};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
`;


export const Menu = styled.div`
  && {
    width: 526px;
    background: ${color.white};
    border: 1px solid ${color.grey};
    box-sizing: border-box;
    border-radius: ${margins.medium};
    box-shadow: none;
  }
`;

export const MenuHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${margins.big} ${margins.big} ${margins.medium} ${margins.big};
`;

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
`;

export const Divider = styled(HeaderHorizontalDivider)`
  transform: rotate(90deg);
  width: ${margins.big};
`;

export const MenuContent = styled.div`
  padding: 0px ${margins.big} ${margins.medium} ${margins.medium};
`;

export const MenuItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${margins.big} ${margins.medium} ${margins.big} ${margins.mini};
`;

export const CardActionsContainer = styled.div`
  && {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: ${margins.large};
    box-shadow: none;
  }
`;
