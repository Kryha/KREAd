import styled from "@emotion/styled";
import { ArrowUpRightIcon, CloseIcon } from "../../assets";
import { DetailSectionWrap } from "../../containers/detail-section/styles";
import { color, margins } from "../../design";
import { fadeIn, Label } from "../atoms";
import { HeaderHorizontalDivider, HorizontalDivider } from "../atoms/lines";

export const Content = styled.div`
  padding: 0px ${margins.small};
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
  width: 12px;
  height: 12px;
  cursor: pointer;
  margin-top: 14px;
`;

interface MenuProps {
  width: number;
  height: number;
}

export const Menu = styled.div<MenuProps>`
  ${({ width, height }): string =>
    `min-width: 500px; max-width: ${width * 0.375}px; width: ${
      width * 0.375
    }px; max-height: ${height - 80}px;`};
  background: ${color.white};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
  box-shadow: none;
  overflow-y: scroll;
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
  ${Label} {
    margin-top: 2px;
  }
`;

export const Divider = styled(HeaderHorizontalDivider)`
  transform: rotate(90deg);
  width: ${margins.big};
  margin-right: 26px;
  margin-left: 12px;
`;

export const MenuContent = styled.div`
  padding: 0px ${margins.medium} 0px ${margins.medium};
  ${HorizontalDivider} {
    margin-top: 16px;
    margin-bottom: 24px;
  }
`;

export const MenuItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${margins.big} ${margins.medium} ${margins.big} ${margins.mini};
`;

export const ArrowUpRight = styled(ArrowUpRightIcon)`
  margin: 0px 0px 0px 13px !important;
`;

export const CardActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${margins.big};
  margin-right: ${margins.large};
  margin-top: ${margins.medium};
  margin-left: ${margins.large};
  box-shadow: none;
`;

export const MenuCardWrapper = styled.div`
  ${DetailSectionWrap} {
    position: absolute;
    bottom: ${margins.large};
    left: ${margins.large};
    z-index: 1000;
  }
  animation: ${fadeIn} 0.6s;
`;
