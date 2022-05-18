import { Card, CardActions } from "@mui/material";
import styled from "styled-components";
import { CloseIcon } from "../../assets";
import { color, margins } from "../../design";
import { HeaderHorizontalDivider } from "../atoms/lines";
import CardContent from '@mui/material/CardContent';

export const Content = styled(CardContent)`
  && {
    padding: 0px 16px;
  }
`;

export const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${margins.mini};
  box-sizing: border-box;
  border-radius: ${margins.medium};
`;

export const Close = styled(CloseIcon)`
  width: ${margins.big};
  height: ${margins.big};
  cursor: pointer;
`;

export const Menu = styled(Card)`
  && {
    width: 526px;
    background: ${color.white};
    border: 1px solid ${color.grey};
    box-sizing: border-box;
    border-radius: ${margins.medium};
    box-shadow: none;
    max-height: 688px;
    overflow-y: scroll;
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
  padding: 0px ${margins.medium} 0px ${margins.medium};
`;

export const MenuItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${margins.big} ${margins.medium} ${margins.big} ${margins.mini};
`;

export const CardActionsContainer = styled(CardActions)`
  && {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
    margin-bottom: ${margins.large};
    margin-right: ${margins.large};
    box-shadow: none;
  }
`;
