import styled from "@emotion/styled";
import { CloseIcon, BellIcon } from "../../assets";
import { SecondaryButton } from "../../components";

import { Group } from "../../components/switch-selector/styles";
import { DetailSectionWrap } from "../../containers/detail-section/styles";
import { color, margins } from "../../design";

export const InventoryWrapper = styled.div`
  ${Group} {
    margin-left: ${margins.big};
    margin-bottom: ${margins.small};
  }
`;

export const OverviewContainer = styled.div`
  border: 1px solid #D0D0D0;
  border-radius: 24px;
  height: 80vh;
  width: 55%;
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

export const DetailWrapper = styled.section`
  ${DetailSectionWrap} {
    height: 70vh;
    max-width: 100%;
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
  width:  ${margins.small};
  height: ${margins.small};
  left: 27px;
  top: -3px;

  background: ${color.black};
  border-radius: ${margins.medium};
  z-index: 1000;
`;
