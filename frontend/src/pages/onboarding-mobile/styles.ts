import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowDownIcon, ArrowUpRightIcon } from "../../assets";
import { bounce, changeSize, CharacterImgs, disappear, fadeIn, PrimaryButton, slideUp, TitleText } from "../../components";
import { KreadIcon } from "../../components/logo/styles";
import { breakpoints, color, fontWeight, zIndex } from "../../design";

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

export const InfoText = styled.div`
  margin-top: 8px;
  ${TitleText} {
    margin-top: 8px;
  }
  // ${({ height }): string => `height: ${height}px; min-height: ${height}px;`};
  margin-bottom: 200px;
  width: 100%;
  height: 100vh;
  background-size: cover;
  scroll-snap-align: start;
  transition: all 0.4s;
`;

export const ArrowUp = styled(ArrowUpRightIcon)`
  margin: 0 0 0 13px !important;
  path {
    stroke: ${color.white};
  }
`;

export const ButtonRow = styled.div`
  position: relative;
  display: flex;
  gap: 16px;
`;
interface ButtonProps {
  isVisible: boolean;
}

export const ButtonContainer = styled.div<ButtonProps>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0;
  gap: 16px;
  z-index: 100;
  ${PrimaryButton} {
    max-height: 45px;
    gap: 8px;
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
      ${ButtonRow} {
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
      ${ButtonRow} {
        position: fixed;
        left: 40px;
        top: 620px;
        z-index: 100;
      }
      `;
  }};

  ${({ isVisible }) =>
    isVisible === true
      ? css``
      : css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 0.5s, 0.5s;
          animation-delay: 0s, 0.5s;
        `};
`;

export const ArrowUpRight = styled(ArrowUpRightIcon)`
  margin: 0 0 0 13px !important;
`;

export const EndContent = styled.div<HeightProps>`
  ${({ height }): string => `height: ${height - 100}px; min-height: ${height - 100}px;`};
  ${TitleText} {
    margin-top: 16px;
  }
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-size: cover;
  scroll-snap-align: start;
  padding-top: 110px;
  gap: 80px;
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
  ${({ height }): string => `height: ${height}px;`};
  scroll-snap-type: y mandatory;
  max-height: 100vh;
  transition: all 0.4s;
  animation: ${disappear}, ${fadeIn};
  animation-duration: 5s, 0.5s;
  animation-delay: 0s, 5s;
  ${({ showAnimation }) =>
    showAnimation
      ? css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 5s, 0.5s;
          animation-delay: 0s, 5s;
        `
      : css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 0.8s, 0.5s;
          animation-delay: 0s, 0.8s;
        `};
`;

export const DefaultImage = styled(CharacterImgs)<ViewProps>`
  position: absolute;
  right: 358px;
  top: 0;
`;

export const Link = styled.a`
  text-decoration: underline;
  font-weight: ${fontWeight.light};
  font-size: 24px;
  line-height: 31px;
  :first-letter {
    text-transform: capitalize;
  }
  color: ${color.darkGrey};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 5px;
`;

export const KryhaLink = styled(Link)`
  margin-left: 0;
`;

export const TextContainer = styled.span`
  font-weight: ${fontWeight.light};
  font-size: 24px;
  line-height: 31px;
  :first-letter {
    text-transform: capitalize;
  }
  :first-of-type {
    margin-top: 8px;
  }
  margin-top: 24px;
  display: inline-block;
  color: ${color.darkGrey};
  white-space: pre-line;

  @media screen and (max-width: ${breakpoints.tablet}) {
    font-size: 16px;
    line-height: 20px;
  }
`;

export const KreadLogo = styled(KreadIcon)`
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.8s, 0.5s;
  animation-delay: 0s, 0.8s;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  margin-top: 40px;
  ${KreadLogo} {
    width: 100px;
    height: 24px;
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
  ${({ showSlider }) =>
    showSlider &&
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
    `};
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
  @media screen and (max-width: ${breakpoints.tablet}) {
    padding-left: 16px;
    width: 100%;
  }
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
  ${({ isVisible }) =>
    isVisible === true
      ? css``
      : css`
          animation: ${disappear}, ${fadeIn};
          animation-duration: 0.5s, 0.5s;
          animation-delay: 0s, 0.5s;
        `};
`;

export const SocialsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SocialLink = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
