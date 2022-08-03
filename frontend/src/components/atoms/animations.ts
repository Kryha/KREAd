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

export const bounce = keyframes`
	0%,
	25%,
	50%,
	75%,
	100% {
		-webkit-transform: translateY(0);
		transform: translateY(0);
	}
	40% {
		-webkit-transform: translateY(-20px);
		transform: translateY(-20px);
	}
	60% {
		-webkit-transform: translateY(-10px);
		transform: translateY(-10px);
	}
`;

export const sequentialFadeIn = keyframes`
  0% {
    opacity: 0;
  }

  50%{
    opacity:1
  }
  100% {
    opacity:0;
  }
`;

export const zoomIn = keyframes`
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.5, 1.5);
  }
  100% {
    transform: scale(1.5, 1.5);
  }
`;

export const fadeUp = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 1rem, 0);
  }
  75% {
    opacity: 0.75;
    transform: translate3d(0, 0, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;
