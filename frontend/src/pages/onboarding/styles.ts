import styled from "@emotion/styled";
import { ArrowUpRightIcon } from "../../assets";
import { TitleText } from "../../components";
import { color } from "../../design";

interface HeightProps {
  height: number;
}

export const OnboardingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px;
  overflow-y: scroll;
  width: 460px;
`;

export const InfoText = styled.div<HeightProps>`
  margin-top: 40px;
  ${TitleText} {
    margin-top: 8px;
  }
  ${({ height }): string => `height: ${height}px; min-height: ${height}px;`};
  margin-bottom: 200px;
`;

export const ButtonContainer = styled.div`
  margin-top: 46px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
`;

export const ArrowUpRight = styled(ArrowUpRightIcon)`
  margin: 0px 0px 0px 13px !important;
`;

export const ArrowUp = styled(ArrowUpRightIcon)`
  margin: 0px 0px 0px 13px !important;
  path {
    stroke: ${color.white};
  }
`;

export const MiddleContent = styled.div<HeightProps>`
  ${({ height }): string => `height: ${height}px; min-height: ${height}px;`};
  ${TitleText} {
    margin-top: 16px;
  }
`;

export const FooterContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;

export const OnboardingContainer = styled.div`
  overflow-y: scroll;
`;
