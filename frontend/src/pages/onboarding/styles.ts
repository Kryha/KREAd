import styled from "@emotion/styled";
import { ArrowUpRightIcon } from "../../assets";
import { PrimaryButton, TitleText } from "../../components";
import { SMALL_SCREEN_WIDTH } from "../../constants";
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
  scroll-snap-align: start;
  transition: all 0.4s;
`;

export const ArrowUp = styled(ArrowUpRightIcon)`
  margin: 0px 0px 0px 13px !important;
  path {
    stroke: ${color.white};
  }
`;

export const ButtonContainer = styled.div`
  margin-top: 46px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  ${PrimaryButton} {
    &:hover {
      ${ArrowUp} {
        path {
          stroke: ${color.black};
        }
      }
    }
  }
`;

export const ArrowUpRight = styled(ArrowUpRightIcon)`
  margin: 0px 0px 0px 13px !important;
`;



export const MiddleContent = styled.div<HeightProps>`
  ${({ height }): string => `height: ${height}px; min-height: ${height}px;`};
  ${TitleText} {
    margin-top: 16px;
  }
  scroll-snap-align: start;
`;

export const FooterContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;
interface ViewProps {
  height: number;
  width: number;
}

export const OnboardingContainer = styled.div<ViewProps>`
  overflow-y: scroll;
  ${({ height }): string => `height: ${height}px;`};
  scroll-snap-type: y mandatory;
  max-height: 100vh;
  overflow-y: scroll;
  transition: all 0.4s;
`;

interface ViewProps {
  height: number;
  width: number;
}

export const DefaultImage = styled.img<ViewProps>`
  position: absolute;
  right: 358px;
  top: 0;
  ${({ width, height }): string =>
    `min-width: ${width * SMALL_SCREEN_WIDTH}px; max-width: ${width * SMALL_SCREEN_WIDTH}px; width: ${width * SMALL_SCREEN_WIDTH}px; height: ${height}px;`};
`;
