import styled from "styled-components";
import { color, fontWeight, margins } from "../../design";
import { DetailSectionProgress } from "../../containers/detail-section/detail-section-progress-bar/styles";
import { HorizontalDivider } from "../atoms";

export const StatsWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${margins.medium};
  gap: ${margins.medium};
  width: 277px;
  height: 317px;
  background: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: ${margins.medium};
  position: absolute;
  z-index: 100;
  left: 189px;
  top: -197px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: ${margins.mini};
`;

export const Title = styled.div`
  font-family: aktiv-grotesk;
  font-style: normal;
  font-weight: ${fontWeight.medium};
  font-size: 16px;
  line-height: 20px;
  color: ${color.black};
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: ${margins.mini};
`;

export const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: ${margins.small};
  ${DetailSectionProgress} {
    width: 229px;
  }
  ${HorizontalDivider} {
    margin-bottom: ${margins.mini}
  }
`;

export const ProgressContainer = styled.div``;
