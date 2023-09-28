import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { color, fontSize, margins } from "../../design";

export const TooltipWrap = styled.div`
  display: inline-block;
  position: relative;
`;

const TooltipAnimation = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const TooltipContent = styled.div`
  max-width: 300px;
  position: absolute;
  border-radius: ${margins.medium};
  border: solid 1px ${color.grey};
  left: 50%;
  transform: translateX(-50%);
  padding: ${margins.medium} ${margins.medium};
  color: ${color.black};
  background: ${color.lightGrey};
  font-size: ${fontSize.medium};
  z-index: 100;
  min-width: 200px;
  box-sizing: border-box;
  animation: ${TooltipAnimation} 0.5s;
  h3 {
    font-size: ${fontSize.title};
    text-transform: capitalize;
    margin-bottom: ${margins.mini};
  }
  p {
    font-size: ${fontSize.subTitle};
    :first-letter {
      text-transform: capitalize;
    }
  }
  &.top {
    top: calc(160px * -1);
    transform: translateX(0) translateY(0);
  }
  &.bottom {
    bottom: calc(${margins.mini} * -1);
  }
  &.left {
    left: auto;
    right: calc(100% + ${margins.mini});
    top: 50%;
    transform: translateX(0) translateY(0);
  }
  &.right {
    left: calc(100% + ${margins.mini});
    top: 50%;
    transform: translateX(0) translateY(0);
  }
`;
