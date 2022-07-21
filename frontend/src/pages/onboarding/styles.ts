import styled from "@emotion/styled";
import { ArrowDownIcon, ArrowUpRightIcon } from "../../assets";
import { bounce, PrimaryButton, TitleText } from "../../components";
import { KreadIcon } from "../../components/logo/styles";
import { SMALL_SCREEN_WIDTH } from "../../constants";
import { color, fontWeight, zIndex } from "../../design";

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
  margin-top: 8px;
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

export const EndContent = styled.div<HeightProps>`
  ${({ height }): string => `height: ${height - 100}px; min-height: ${height - 100}px;`};
  ${TitleText} {
    margin-top: 16px;
  }
  scroll-snap-align: start;
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
  z-index: ${zIndex.overCharacter};
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

export const Email = styled.a`
  text-decoration: none;
  font-family: "aktiv-grotesk";
  font-weight: ${fontWeight.light};
  font-size: 24px;
  line-height: 31px;
  :first-letter {
    text-transform: capitalize;
  }
  color: ${color.darkGrey};
  display: inline;
`;

export const EmailContainer = styled.span`
  font-family: "aktiv-grotesk";
  font-weight: ${fontWeight.light};
  font-size: 24px;
  line-height: 31px;
  :first-letter {
    text-transform: capitalize;
  }
  display: inline-block;
  color: ${color.darkGrey};
  margin-top: 8px;
`;
export const KreadContainer = styled.div<ViewProps>`
  ${KreadIcon} {
    position: absolute;
    left: 45%;
    transform: translate(-45%, 0);
    top: 40px;
    width: 100px;
    height: 24px;
  }
`;

export const ArrowDown = styled(ArrowDownIcon)`
  position: absolute;
  left: 16.2%;
  bottom: 53px;
  -webkit-animation: ${bounce} 2s;
  animation: ${bounce} 2s;
  -webkit-animation-iteration-count: 2;
  animation-iteration-count: 2;
  animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards;
  animation-delay: 0.5s;
  -webkit-animation-delay: 0.5s;
`;
