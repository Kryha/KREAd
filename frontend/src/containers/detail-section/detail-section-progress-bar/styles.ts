import styled from "styled-components";
import { color, fontWeight, margins } from "../../../design";

export const DetailSectionProgressBarWrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${margins.medium};
`;

export const DetailSectionProgress = styled.progress`
  color: ${color.black};
  border: 1px solid ${color.grey};
  border-radius: 2px;
  padding: 2px;
  &[value] {
    color: ${color.black};
    border: 1px solid ${color.grey};
    border-radius: 2px;
    padding: 2px;
    width: 100%;
  }
  &::-webkit-progress-bar {
    background-color: transparent;
  }
  &::-webkit-progress-value {
    background-color: ${color.black};
  }
  &::-moz-progress-bar {
    background-color: transparent;
  }
`;

export const DetailSectionProgressDigits = styled.span`
  font-weight: ${fontWeight.regular};
  min-width: 65px;
`;
