import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ArrowUpRightIcon } from "../../assets";
import {  changeSize, CharacterImgs, disappear, fadeIn, PrimaryButton, slideUp, TitleText } from "../../components";
import { KreadIcon } from "../../components/logo/styles";
import { color, fontWeight } from "../../design";

interface HeightProps {
  height: number;
}

export const OnboardingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

export const OnboardingContainer = styled.div<ViewProps>`
  height: 100%;
  scroll-behavior: smooth;
  overflow: auto;
  scroll-snap-type: y mandatory;
  padding: 10px 10px 10px 10px;
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

export const OnboardingCharacterWrapper = styled.div`
  display: flex;
  position: relative;
  height: 50%;
  margin: 17% 5% 7% 5%;
`;

export const InfoText = styled.div`
  ${TitleText} {
    margin-top: 8px;
  }
  width: 100%;
  height: 100%;
  margin-bottom: 200px;
  background-size: cover;
  scroll-snap-align: start;
  transition: all 0.4s;
`;

export const MiddleContent = styled.div<HeightProps>`
  ${TitleText} {
    margin-top: 16px;
  }
  margin-bottom: 200px;
  width: 100%;
  height: 100%;
  background-size: cover;
  scroll-snap-align: start;
`;

export const EndContent = styled.div<HeightProps>`
  ${TitleText} {
    margin-top: 16px;
  }
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-size: cover;
  scroll-snap-align: start;
  gap: 40px;
`;

interface ViewProps {
  height?: number;
  width?: number;
  showSlider?: boolean;
  showAnimation?: boolean;
}

export const DefaultImage = styled(CharacterImgs)<ViewProps>`
  position: absolute;
  right: 358px;
  top: 0;
`;

export const Link = styled.a`
  text-decoration: underline;
  font-weight: ${fontWeight.light};
  font-size: 16px;
  line-height: 20px;
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

interface TextProps {
  customColor?: string;
}
export const TextContainer = styled.span<TextProps>`
  font-weight: ${fontWeight.light};
  font-size: 16px;
  line-height: 22px;
  :first-letter {
    text-transform: capitalize;
  }

  margin-top: 24px;
  display: inline-block;
  ${({ customColor }): string => `color: ${customColor || color.darkGrey};`};
  white-space: pre-line;
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
  margin-top: 30px;
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
    width: 80%;
    animation: ${changeSize} 4s 1;
    animation-fill-mode: forwards;
    animation-delay: 3.8s;
  }
  ${({ showSlider }) =>
    showSlider &&
    css`
    display: flex;
    flex: 1;
    justify-content: center;
    margin-top: 30px;
      ${KreadIcon} {
        position: relative;
        width: 100px;
        height: 24px;
      }
    `};
`;

export const SectionContainer = styled.div`
  padding-left: 20px;
  padding-top: 4%;
`;

export const SocialsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0px;
`;

export const ButtonRow = styled.div`
  position: relative;
  display: flex;
  gap: 16px;
`;

export const ArrowUp = styled(ArrowUpRightIcon)`
  margin: 0 0 0 13px !important;
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
  justify-content: center;
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
`;