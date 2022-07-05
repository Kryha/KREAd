import styled from "@emotion/styled";
import { BellIcon, CloseIcon, DownArrowIcon } from "../../assets";
import { SecondaryButton } from "../../components";
import { Box } from "../../components/base-route/styles";
import { EquippedContainer } from "../../components/equipped-item-card/styles";
import { ActiveLine, Tab } from "../../components/navigation-tab/styles";
import { color, margins, zIndex } from "../../design";

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

export const BaseWrapper = styled.div``;

interface NotificationProps {
  open: boolean;
}

export const NotificationButton = styled(SecondaryButton) <NotificationProps>`
  padding: ${margins.mini};
  position: relative;
  z-index: 1000;
  ${Close} {
    margin: 0px 6px !important;
    width: 15px;
    height: 15px;
  }
  ${({ open }): string => {
    return open
      ? `
        border-color: ${color.black} !important;
        `
      : `

      `;
  }};
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

export const NotificationContainer = styled.div`
  position: relative;
`;

export const Tag = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${margins.nano} ${margins.mini};
  gap: 10px;

  position: absolute;
  width:  ${margins.small};
  height: ${margins.small};
  left: 27px;
  top: -3px;

  background: ${color.black};
  border-radius: ${margins.medium};
  z-index: 1000;
`;

export const OnboardingConnectWrapper = styled.div`
  ${Box} {
    pointer-events: none;
  }
  ${EquippedContainer} {
    pointer-events: none;
  }
  ${Tab} {
    &:first-child(1) {
      ${ActiveLine} {
        height: 4px;
        background: ${color.black};
      }
    }
  }
`;
