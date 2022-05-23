import styled from "styled-components";
import { color, fontSize, margins } from "../../design";

export const TooltipWrap = styled.section`
  display: inline-block;
  position: relative;
`;

export const TooltipContent = styled.div`
  max-with: 300px;
  position: absolute;
  border-radius: ${margins.medium};
  border: solid 1px ${color.grey};
  left: 50%;
  transform: translateX(-50%);
  padding: ${margins.small} ${margins.medium};
  color: ${color.black};
  background: ${color.white};
  font-size: ${fontSize.medium};
  z-index: 100;
  white-space: nowrap;
  h3 {
    font-size: ${fontSize.title};
    text-transform: capitalize;
    margin-bottom: ${margins.mini};
  }
  p {
    font-size: ${fontSize.subTitle};
  }
  &.top {
    top: calc(${margins.large} * -1);
  }
  &.bottom {
    bottom: calc(${margins.large} * -1);
  }
  &.left {
    left: auto;
    right: calc(100% + ${margins.large});
    top: 50%;
    transform: translateX(0) translateY(-50%);
  }
  &.right {
    left: calc(100% + ${margins.large});
    top: 50%;
    transform: translateX(0) translateY(-50%);
  }
`;
