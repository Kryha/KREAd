import styled from '@emotion/styled';

interface MainProps {
  height: number;
}

export const MainWrap = styled.div<MainProps>`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  ${({ height }): string => `height: ${height}px;`};
`;
