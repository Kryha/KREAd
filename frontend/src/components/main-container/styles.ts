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
  @media screen and (max-width: 768px) {
    height: 100vh;
    max-height: 100vh;
    min-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;
