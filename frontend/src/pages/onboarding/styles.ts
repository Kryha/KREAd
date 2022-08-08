import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowDownIcon, ArrowUpRightIcon } from "../../assets";
import { bounce, changeSize, CharacterImgs, disappear, fadeIn, PrimaryButton, slideUp, TitleText } from "../../components";
import { KreadIcon } from "../../components/logo/styles";
import { color, fontWeight, zIndex } from "../../design";

interface HeightProps {
  height: number;
}

export const OnboardingWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  scroll-behavior: smooth;
  overflow: auto;
  scroll-snap-type: y mandatory;
`;

export const InfoText = styled.div<HeightProps>`
  margin-top: 8px;
  ${TitleText} {
    margin-top: 8px;
  }
  ${({ height }): string => `height: ${height}px; min-height: ${height}px;`};
  margin-bottom: 200px;
  width: 100%;
  height: 100vh;
  background-size: cover;
  scroll-snap-align: start;
  transition: all 0.4s;
`;

export const ArrowUp = styled(ArrowUpRightIcon)`
  margin: 0px 0px 0px 13px !important;
  path {
    stroke: ${color.white};
  }
`;

interface ButtonProps {
  isVisible: boolean;
}

export const ButtonContainer = styled.div<ButtonProps>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  z-index: 100;
  ${PrimaryButton} {
    &:hover {
      ${ArrowUp} {
        path {
          stroke: ${color.black};
        }
      }
    }
  }
  ${({ isVisible }): string => {
    return isVisible
      ? `
      ${PrimaryButton} {
        -webkit-transition: 0.3s ease-out;
        transition: 0.3s ease-out;
        will-change: transform;
        position: absolute;
        left: 40px;
        top: 40px;
      };
      background: rgba(255, 255, 255, 0.46);
      backdrop-filter: blur(4px);
      padding-top: 40px;
      padding-bottom: 40px;
      height: 120px;
      width: 460px;
      position: absolute;
        `
      : `
      margin-top: 46px;
      ${PrimaryButton} {
        position: fixed;
        left: 40px;
        top: 464px;
        z-index: 100;
      }
      `;
  }};

  ${({ isVisible }) => (isVisible === true ?
    css` `
    :
    css`
    animation: ${disappear}, ${fadeIn};
    animation-duration: 0.5s, 0.5s;
    animation-delay: 0s, 0.5s;

  `)};
`;

export const ArrowUpRight = styled(ArrowUpRightIcon)`
  margin: 0px 0px 0px 13px !important;
`;

export const EndContent = styled.div<HeightProps>`
  ${({ height }): string => `height: ${height - 100}px; min-height: ${height - 100}px;`};
  ${TitleText} {
    margin-top: 16px;
  }
  width: 100%;
  height: 100vh;
  background-size: cover;
  scroll-snap-align: start;
  padding-top: 110px;
`;

export const MiddleContent = styled.div<HeightProps>`
  ${({ height }): string => `height: ${height}px; min-height: ${height}px;`};
  ${TitleText} {
    margin-top: 16px;
  }
  width: 100%;
  height: 100vh;
  background-size: cover;
  scroll-snap-align: start;
  padding-top: 110px;
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
  showSlider?: boolean;
  showAnimation?: boolean;
}
export const OnboardingContainer = styled.div<ViewProps>`
  overflow-y: scroll;
  ${({ height }): string => `height: ${height}px;`};
  scroll-snap-type: y mandatory;
  max-height: 100vh;
  overflow-y: scroll;
  transition: all 0.4s;
  animation: ${disappear}, ${fadeIn};
  animation-duration: 5.0s, 0.5s;
  animation-delay: 0s, 5.0s;
  ${({ showAnimation }) => (showAnimation ?
    css`
      animation: ${disappear}, ${fadeIn};
      animation-duration: 5.0s, 0.5s;
      animation-delay: 0s, 5.0s;
    ` :
    css`
      animation: ${disappear}, ${fadeIn};
      animation-duration: 0.8s, 0.5s;
      animation-delay: 0s, 0.8s;
  `)};
`;

export const DefaultImage = styled(CharacterImgs) <ViewProps>`
  position: absolute;
  right: 358px;
  top: 0;
`;

export const Link = styled.a`
  text-decoration: underline;
  font-family: "aktiv-grotesk";
  font-weight: ${fontWeight.light};
  font-size: 24px;
  line-height: 31px;
  :first-letter {
    text-transform: capitalize;
  }
  color: ${color.darkGrey};
  display: inline;
  margin-left: 5px;
`;

export const KryhaLink = styled(Link)`
  margin-left: 0px;
`;

export const TextContainer = styled.span`
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

export const KreadLogo = styled(KreadIcon)`
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.8s, 0.5s;
  animation-delay: 0s, 0.8s;
`;

export const LogoContainer = styled.div`
  ${KreadLogo} {
    position: absolute;
    left: 50%;
    transform: translate(-45%, 0);
    top: 40px;
    bottom: 50%;
    width: 100px;
    height: 24px;
    right: 50%;
  }
`;

export const KreadContainer = styled.div<ViewProps>`
  ${KreadIcon} {
    top: 0;
    bottom: 0;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    width: 500px;
    height: 150px;
    animation: ${changeSize} 4s 1;
    animation-fill-mode: forwards;
    animation-delay: 3.8s;
  }

  ${({ showSlider }) => (showSlider &&
    css`
    animation: ${slideUp};
    animation-duration: 0.7s;
    animation-delay: 0s;
    animation-fill-mode: forwards;
    ${KreadIcon} {
      position: absolute;
      left: 0;
      transform: translate(-45%, 0);
      top: 50%;
      bottom: 50%;
      width: 100px;
      height: 24px;
    }
    `)};
`;

export const ArrowDown = styled(ArrowDownIcon)`
  position: absolute;
  left: 40px;
  bottom: -2px;
  -webkit-animation: ${bounce} 2s;
  animation: ${bounce} 2s;
  -webkit-animation-iteration-count: 2;
  animation-iteration-count: 2;
  animation-fill-mode: backwords;
  -webkit-animation-fill-mode: backwords;
  animation-delay: 6s;
  -webkit-animation-delay: 6s;
  path {
    stroke: ${color.black};
  }
  width: 24px;
  height: 24px;
`;

export const SectionContainer = styled.div`
  padding-left: 40px;
  padding-top: 50px;
  width: 460px;
`;

export const ScrollContainer = styled.div`
  position: absolute;
  left: 40px;
  bottom: 73px;
`;

export const GeneralSectionContainer = styled.div`
  padding-left: 40px;
  width: 460px;
`;

export const ConnectContainer = styled.div<ButtonProps>`
${({ isVisible }): string => {
    return isVisible
      ? `
        background: rgba(255, 255, 255, 0.46);
        backdrop-filter: blur(4px);
        z-index: 100;
        width: 460px;
        padding-top: 40px;
        padding-bottom: 40px;
        position: relative;
      `
      : "";
  }};
  ${({ isVisible }) => (isVisible === true ?
    css` `
    :
    css`
    animation: ${disappear}, ${fadeIn};
    animation-duration: 0.5s, 0.5s;
    animation-delay: 0s, 0.5s;

  `)};
`;
