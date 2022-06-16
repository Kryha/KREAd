import styled from "@emotion/styled";

import { BellIcon, CloseIcon, DownArrowIcon } from "../../assets";
import { SecondaryButton } from "../../components";
import { TopbarContainer } from "../../components/base-route/styles";
import { margins } from "../../design";

interface ImageProps {
  isZoomed?: boolean;
}

export const LandingContainer = styled.div<ImageProps>``;

export const Menu = styled(DownArrowIcon)`
  margin: 0px 0px 0px 11px !important;
  width: 12px;
`;

export const Close = styled(CloseIcon)`
  margin: 0px 0px 0px 11px !important;
  width: 12px;
`;

export const NotificationButton = styled(SecondaryButton)`
  padding: ${margins.mini};
  ${Close} {
    margin: 0px 6px !important;
    width: 15px;
    height: 15px;
  }
`;

export const NotificationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: ${margins.small};
`;

export const Notification = styled(BellIcon)`
  width: 15px;
  height: 15px;
`;


interface BaseView {
  hideView: boolean;
}

export const BaseWrapper = styled.div<BaseView>`
  ${({ hideView }): string => {
    return hideView
      ? `
      ${TopbarContainer} {
       display: none;
      }
        `
      : "";
  }};
`;

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: ${margins.nano};
  margin-left: ${margins.big};
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 12px;
`;

export const CharacterCardWrapper = styled.div`
  position: absolute;
  z-index: 10000;
  bottom: ${margins.big};
  left: 30px;
`;
