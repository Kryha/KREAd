import styled from "@emotion/styled";
import { CloseIcon, BellIcon } from "../../assets";
import { SecondaryButton } from "../../components";
import { disappear, fadeIn, fadeUp } from "../../components/atoms/animations";
import { KreadIcon } from "../../components/logo/styles";

import { Group } from "../../components/switch-selector/styles";
import { DetailSectionWrap } from "../../containers/detail-section/styles";
import { color, margins } from "../../design";

interface ViewProps {
  width: number;
  height: number;
}

export const InventoryWrapper = styled.div`
  ${Group} {
    margin-left: ${margins.big};
    margin-bottom: ${margins.small};
  }
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.2s, 0.4s;
  animation-delay: 0s, 0.2s;
`;

export const OverviewContainer = styled.div`
  border: 1px solid #d0d0d0;
  border-radius: 24px;
  height: 75vh;
`;

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 24px 8px 8px;
  gap: 24px;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;
`;

export const NotificationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: ${margins.small};
`;

export const Close = styled(CloseIcon)`
  margin: 0px 0px 0px 11px !important;
  width: 12px;
`;

export const Notification = styled(BellIcon)`
  width: 15px;
  height: 15px;
`;

interface NotificationProps {
  open: boolean;
}

export const NotificationButton = styled(SecondaryButton)<NotificationProps>`
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

export const DetailWrapper = styled.section`
  ${DetailSectionWrap} {
    position: absolute;
    right: 40px;
    bottom: 40px;
    height: 80vh;
    max-width: 52.7%;
  }
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
  width: ${margins.small};
  height: ${margins.small};
  left: 27px;
  top: -3px;

  background: ${color.black};
  border-radius: ${margins.medium};
  z-index: 1000;
`;

export const DetailContainer = styled.div`
  animation: ${fadeUp} 1.2s ease-out 0s forwards;
  opacity: 0;
  transform: translate3d(0, 1rem, 0);
  width: 60%;
  ${DetailSectionWrap} {
    max-width: 100%;
  }
`;

export const KreadContainer = styled.div<ViewProps>`
  ${KreadIcon} {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    top: 40px;
    width: 100px;
    height: 24px;
  }
`;
