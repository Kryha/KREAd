import styled from "@emotion/styled";

interface MainProps {
  height: number;
}

export const MainWrap = styled.div<MainProps>`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;
