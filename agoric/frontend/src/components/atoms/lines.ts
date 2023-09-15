import styled from "@emotion/styled";
import { color, margins } from "../../design";

interface DividersProps {
  customColor?: string;
}

export const HorizontalDivider = styled.div<DividersProps>`
  height: 1px;
  width: 100%;
  background-color: ${(props): string => props.customColor || color.grey};
`;

export const HeaderHorizontalDivider = styled(HorizontalDivider)`
  margin: ${margins.medium} 0;
`;

export const VerticalDivider = styled.div`
  height: 100%;
  width: 1px;
`;

export const Dash = styled.div`
  width: 16px;
  height: 0px;
  border: 0.5px solid ${color.darkGrey};
  margin-right: 8px;
  margin-left: 8px;
`;

export const Diagonal = styled.div`
  border: 0.5px solid ${color.grey};
  transform: rotate(135deg);
  width: 126px;
  top: 38px;
  position: absolute;
  left: -20px;
`;
