import styled from "styled-components";
import { color } from "../../design";

export const SidebarContainer = styled.div`
  background: ${color.offWhite};
  max-width: 360px;
  min-width: 200px;
  flex: 25;
  transition: all 0.4s;
  opacity: 1;
  z-index: 0;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const MainPageContainer = styled.div`
  overflow-y: scroll;
`;

export const MainWrap = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: row;
  overflow: hidden;
  height: 100vh;
`;
