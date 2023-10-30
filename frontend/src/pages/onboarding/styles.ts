import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowUpIcon, ArrowUpRightIcon, DiscordIcon, TwitterIcon } from "../../assets";
import { ButtonText, changeSize, disappear, fadeIn, PrimaryButton, slideUp, TitleText } from "../../components";
import { KreadIcon } from "../../components/logo/styles";
import { breakpoints, color, fontWeight, zIndex } from "../../design";

interface HeightProps {
  height: number;
}

export const OnboardingWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

export const SectionHeading = styled.h1`
  font-weight: ${fontWeight.medium};
  font-size: 32px;
  line-height: 41px;
  word-break: keep-all;
  white-space: pre-wrap;
  :first-letter {
    text-transform: capitalize;
  }
`;

interface TextProps {
  customColor?: string;
}

export const SectionText = styled.p<TextProps>`
  margin-top: 16px;
  font-weight: ${fontWeight.light};
  font-size: 24px;
  line-height: 32px;
  white-space: pre-line;
  max-width: 100%;
  :first-letter {
    text-transform: capitalize;
  }
  ${({ customColor }): string => `color: ${customColor || color.black};`};

  @media screen and (max-width: ${breakpoints.tablet}) {
    max-width: 100%;
    font-size: 16px;
    line-height: 24px;
  }
`;

interface SectionProps {
  last?: boolean;
}
export const SectionWrapper = styled.div<SectionProps>`
  display: flex;
  scroll-snap-align: center;
  padding: 0 40px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  ${({ last }): string => (last ? "flex-direction: row;" : "flex-direction: column;")};

  @media (max-width: ${breakpoints.tablet}) {
    padding: 24px 24px;
    flex-direction: row;
  }

  @media (max-width: ${breakpoints.mobile}) {
    padding: 24px 16px;
    flex-direction: row;
  }
`;

export const SectionContainer = styled.div<SectionProps>`
  display: flex;
  width: 100%;
  height: 100%;
  transform: translateX(-100px);
  opacity: 0;
  gap: 0;
  ${({ last }): string => (last ? "flex-direction: column; justify-content: space-between" : "flex-direction: row;")};

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const EndContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;
export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;

  @media screen and (max-width: ${breakpoints.tablet}) {
    width: 100%;
  }
`;

export const RightContent = styled.div`
  display: flex;
  position: relative;
  width: 50%;

  @media screen and (max-width: ${breakpoints.tablet}) {
    display: flex;
    position: relative;
    width: 100%;
    height: 800px;
  }

  @media screen and (max-width: ${breakpoints.mobile}) {
    display: flex;
    position: relative;
    width: 100%;
    height: 500px;
  }
`;

export const TopContent = styled.div`
  position: relative;
  width: 50%;
`;
export const BottomContent = styled.div`
  position: relative;
  width: 50%;
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
  margin: 0 0 0 13px !important;
  path {
    stroke: ${color.white};
  }
`;

export const ButtonRow = styled.div`
  position: absolute;
  display: flex;
  gap: 16px;
  margin-top: auto;
  margin-bottom: auto;
  top: 70%;
  left: 25%;
  transform: translate(-50%, -50%);
  z-index: 100;

  @media (max-width: ${breakpoints.tablet}) {
    justify-content: center;
    flex-direction: column;
    top: 60%;
    left: 50%;
    width: 70%;
    transform: translate(-50%, -50%);
  }
`;
interface ButtonProps {
  isVisible: boolean;
}

export const ButtonContainer = styled.div<ButtonProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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

export const ScrollUp = styled(ArrowUpIcon)`
  width: 24px;
  height: 24px;
`;

export const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  bottom: 0;
  position: relative;
  z-index: ${zIndex.overCharacter};
`;

export const ScrollButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    ${ButtonText} {
      color: ${color.black};
    }
    ${ScrollUp} {
      path {
        stroke: ${color.black};
      }
    }
  }

  ${ButtonText} {
    color: ${color.grey};
  }

  ${ScrollUp} {
    width: 24px;
    height: 24px;
    path {
      stroke: ${color.grey};
    }
  }
`;

interface ViewProps {
  height: number;
  width: number;
  showSlider?: boolean;
  showAnimation?: boolean;
}

interface OnboardingProps {
  height: number;
}
export const OnboardingContainer = styled.div<OnboardingProps>`
  overflow-y: scroll;
  ${({ height }): string => `height: ${height - 64}px;`};
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
  width: 100px;
  height: 24px;
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
  display: flex;
  position: relative;
  flex: 1;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: 100%;
  padding: 0 40px;
  ${KreadIcon} {
    width: 100%;
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
    `};
`;

export const SocialsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  height: 100%;
`;

export const Twitter = styled(TwitterIcon)`
  width: 32px;
  height: 32px;
`;
export const Discord = styled(DiscordIcon)`
  width: 32px;
  height: 32px;
`;

export const SocialLink = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &:hover {
    ${ButtonText} {
      color: ${color.black};
    }
    ${Twitter} {
      path {
        fill: ${color.black};
      }
    }
    ${Discord} {
      path {
        fill: ${color.black};
      }
    }
  }
`;
