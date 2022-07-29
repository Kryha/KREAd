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
		-webkit-transform: translateY(-60px);
		transform: translateY(-60px);
	}
	60% {
		-webkit-transform: translateY(-50px);
		transform: translateY(-50px);
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
