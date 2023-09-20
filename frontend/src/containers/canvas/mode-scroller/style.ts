import styled from "@emotion/styled";
import { PageTitle } from "../../../components";

export const ModeScrollerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 auto;
  width: 100%;
`;

export const ModeButton = styled.button`
  font-size: 24px;
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
`;

export const ModeAnimationContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModeName = styled(PageTitle)`
  display: flex;
  transition: transform 0.3s ease;
  position: absolute;
  width: 100%;
  animation: slide 0.3s ease forwards;
  @keyframes slide {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }
`;
