import styled from "@emotion/styled";
import { CloseIcon } from "../../assets";
import { fadeUp } from "../../components";
import { DetailSectionWrap } from "../../containers/detail-section/styles";
import { breakpoints, color, margins } from "../../design";

export const OverviewContainer = styled.div`
  border: 1px solid #d0d0d0;
  border-radius: 24px;
  height: 75vh;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 8px;
`;

export const NotificationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: ${margins.small};
`;

export const Close = styled(CloseIcon)`
  margin: 0 0 0 11px !important;
  width: 12px;
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

export const InventoryWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  ${DetailSectionWrap} {
    position: absolute;
    top: 0;
    left: 25%;
    z-index: 1000;
  }

  @media screen and (max-width: ${breakpoints.mobile}) {
    margin: 0;
  }
`;
