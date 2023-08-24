import styled from "@emotion/styled";
import { color, fontWeight, margins } from "../../../design";

interface ProgressBarProps {
  value: number;
  max: number;
}
export const DetailSectionProgressBarWrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${margins.medium};
  width: 100%;
`;

export const DetailSectionProgress = styled.div`
  border: 1px solid ${color.grey};
  border-radius: 10px;
  width: 100%;
  height: 20px;
`;

export const DetailSectionProgressValue = styled.div<ProgressBarProps>`
  width: ${(props) => props.value}%;
  background: ${color.black};
  border-radius: 10px;
  height: 100%;
`;

export const DetailSectionProgressDigits = styled.span`
  font-weight: ${fontWeight.regular};
  min-width: 65px;
`;
