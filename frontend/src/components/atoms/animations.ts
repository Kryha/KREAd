import { keyframes } from "@emotion/react";

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
`;

export const slideUpOpacity = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0,20%,0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
`;

export const disappear = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`;

export const slideInUp = keyframes`
  0% {
    -webkit-transform: translate3d(0,5%,0);
    opacity: 0;
    transform: translate3d(0,5%, 0);
  }
  100% {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
`;

export const slideLeft = keyframes`
  0% {
    right: 0;
  }
  50% {
    right: 140%;
  }
  100% {
    right: 140%;
  }
`;
