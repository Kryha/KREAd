import styled from "@emotion/styled";
import { color, fontWeight, margins } from "../../design";
import { DetailSectionProgress } from "../../containers/detail-section/detail-section-progress-bar/styles";
import { HorizontalDivider } from "../atoms";
import { fadeIn } from "../atoms/animations";

interface ItemProps {
  position: string;
  area: string;
}

export const StatsWrapper = styled.div<ItemProps>`
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
  z-index: 1000;
  animation: ${fadeIn} 0.3s;
  ${({ position, area }): string => {
    switch (area) {
      case "top":
        if (position === "left") {
          return "left: 175px; top: -197px;";
        }
        else {
          return "right: 165px; top: -197px;";
        }
      case "middle":
        if (position === "left") {
          return "left: 335px; top: -53px;";
        }
        else {
          return "right: 329px; top: -53px;";
        }
      case "bottom":
        if (position === "left") {
          return "left: 335px; top: 90px;";
        }
        else {
          return "right: 329px; top: 90px;";
        }
      default:
        if (position === "left") {
          return "left: 350px; top: -53px;";
        }
        else {
          return "right: 330px; top: -53px;";
        }
    }
  }};
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
  width: 100%;
  ${DetailSectionProgress} {
    width: 229px;
  }
  ${HorizontalDivider} {
    margin-bottom: ${margins.mini}
  }
`;

export const ProgressContainer = styled.div`
  width: 100%;
`;

export const LevelContainer = styled.div``;
