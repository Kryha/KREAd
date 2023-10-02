import styled from "@emotion/styled";
import { breakpoints, color, fontSize, margins } from "../../../design";
import { HelpIcon, NextIcon, PreviousIcon } from "../../../assets";
import { ButtonText, disappear, fadeIn, SecondaryButton } from "../../../components";

interface StyleProps {
  width: number;
  height: number;
}
export const Layout = styled.div<StyleProps>`
  display: grid;
  position: absolute;
  top: 0;
  left: 0;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "canvas";
  width: 100vw;
  height: 100vh;

  @media screen and (max-width: ${breakpoints.tablet}) {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 0fr;
    grid-template-areas: "canvas" "bottom-pane";
  }
`;

export const LeftPane = styled.div`
  grid-area: left-pane;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

export const RightPane = styled.div`
  grid-area: right-pane;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export const CanvasArea = styled.div`
  grid-area: canvas;
  position: relative;
  display: flex;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  justify-content: center;
  align-items: center;
  overflow: hidden !important;
  width: 100vw;

  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.6s, 0.8s;
  animation-delay: 0s, 0.6s;
`;

export const ItemNavigationActions = styled.div`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  grid-template-rows: auto;
  align-items: center;
  height: 35px;
`;

export const ItemNavigationContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: min-content;
  grid-template-columns: auto;
`;

export const ItemNavigationNextButton = styled(SecondaryButton)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  border: 1px solid ${color.grey};
  height: 100%;
  width: 100%;
  background: ${color.white};

  &::before {
    content: "Next Item";
    position: absolute;
    bottom: -2rem; /* Adjust the vertical position as needed */
    left: 50%;
    transform: translateX(-50%);
    background: ${color.black};
    color: ${color.white};
    padding: 0.25rem 0.5rem;
    font-size: ${fontSize.extraSmall};
    border-radius: ${margins.mini};
    opacity: 0;
    width: max-content;
    transition: opacity 0.3s ease-in-out;
  }
  &:hover::before {
    opacity: 1;
  }
  &:hover {
    background: ${color.lightGrey};
  }
`;

export const NavInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${color.black};
  font-size: ${fontSize.extraSmall};
  background: ${color.white};
  border-radius: 0;
  border: 1px solid ${color.grey};
  height: 100%;
  width: 100px;
  position: relative;
  ${ButtonText} {
    text-wrap: avoid;
  }
`;

export const ResetButton = styled(SecondaryButton)`
  justify-content: center;
  color: ${color.black};
  font-size: ${fontSize.extraSmall};
  background: ${color.white};
  border-radius: 0;
  border: 1px solid ${color.grey};
  height: 100%;
  width: 100%;

  position: relative;
  /* Add styles for the pop-up */
  &::before {
    content: "Reset";
    position: absolute;
    top: -2rem; /* Adjust the vertical position as needed */
    left: 50%;
    transform: translateX(-50%);
    background: ${color.black};
    color: ${color.white};
    padding: 0.25rem 0.5rem;
    font-size: ${fontSize.extraSmall};
    border-radius: ${margins.mini};
    opacity: 0;
    width: max-content;
    transition: opacity 0.3s ease-in-out;
  }

  /* Show the pop-up on hover */
  &:hover::before {
    opacity: 1;
  }
  &:hover {
    background: ${color.lightGrey};
  }
`;

export const LoadingCharacter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
export const ItemNavigationPreviousButton = styled(SecondaryButton)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  border: 1px solid ${color.grey};
  height: 100%;
  width: 100%;
  background: ${color.white};

  &::before {
    content: "Previous Item";
    position: absolute;
    bottom: -2rem; /* Adjust the vertical position as needed */
    left: 50%;
    transform: translateX(-50%);
    background: ${color.black};
    color: ${color.white};
    padding: 0.25rem 0.5rem;
    font-size: ${fontSize.extraSmall};
    border-radius: ${margins.mini};
    opacity: 0;
    width: max-content;
    transition: opacity 0.3s ease-in-out;
  }
  &:hover::before {
    opacity: 1;
  }
  &:hover {
    background: ${color.lightGrey};
  }
`;

export const ItemNavigationNext = styled(NextIcon)`
  svg {
    height: 20px;
    width: 20px;
  }
`;

export const ItemNavigationPrevious = styled(PreviousIcon)`
  svg {
    height: 20px;
    width: 20px;
  }
`;

export const HelpText = styled.div`
  position: absolute;
  top: 100px;
  font-size: 16px;
  color: ${color.darkGrey};
`;

export const ItemCountText = styled.div`
  position: absolute;
  bottom: 100px;
  font-size: 14px;
  color: #444;
`;

export const ControlAreaBottomWrapper = styled.footer`
  //position: absolute;
  width: 100%;
  opacity: 1;
  bottom: 2rem;
  pointer-events: all;
  z-index: 2;
`;

export const ControlAreaBottom = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 24px;
  border-radius: 20px;
  padding: 0 20px;
`;

interface HelpProps {
  showHelp: boolean;
}
export const HelpButton = styled(SecondaryButton)<HelpProps>`
  padding: 19px 3px;
  border-radius: 50%;
  background: ${(props) => (props.showHelp ? color.black : color.white)};

  position: relative;
  /* Add styles for the pop-up */
  &::before {
    content: "Toggle Hints";
    position: absolute;
    top: -2rem; /* Adjust the vertical position as needed */
    left: 50%;
    transform: translateX(-50%);
    background: ${color.black};
    color: ${color.white};
    padding: 0.25rem 0.5rem;
    font-size: ${fontSize.extraSmall};
    border-radius: ${margins.mini};
    opacity: 0;
    width: max-content;
    transition: opacity 0.3s ease-in-out;
  }

  /* Show the pop-up on hover */
  &:hover::before {
    opacity: 1;
  }
  &:hover {
    background: ${(props) => (props.showHelp ? color.black : color.white)};
  }
`;

export const Help = styled(HelpIcon)<HelpProps>`
  svg {
    height: 20px;
    width: 20px;
    margin: 0;
  }
  path {
    fill: ${(props) => (props.showHelp ? color.white : color.black)};
  }
`;
