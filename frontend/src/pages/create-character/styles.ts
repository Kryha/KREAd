import styled from "styled-components";

import { color } from "../../design";

interface ViewProps {
  height: number;
  width: number;
}

export const DefaultImage = styled.img<ViewProps>`
  margin-left: 140px;
  top: 0;
  ${({ width, height }): string => `min-width: ${width * 0.4}px; max-width: ${width * 0.4}px; width: ${width * 0.4}px; height: ${height}px;`};
`;

export const FormCard = styled.div<ViewProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 526px;
  background: ${color.gradientLight};
  border: 1px solid ${color.grey};
  border-radius: 24px;
  margin-top: 40px;
  ${({ height }): string => ` height: ${height - 80}px;`};
`;
