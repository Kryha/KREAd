import styled from "styled-components";
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
