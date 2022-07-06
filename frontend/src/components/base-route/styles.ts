import styled from "@emotion/styled";
import { margins, zIndex } from "../../design";
import { disappear, fadeIn } from "../atoms/animations";

export const TopbarContainer = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: ${margins.big};
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.8s, 2s;
  animation-delay: 0s, 0.8s;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px;
`;

export const ChildrenContainer = styled.div`
  margin-bottom: 40px;
`;

export const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: ${zIndex.overCharacter};
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.8s, 2s;
  animation-delay: 0s, 0.8s;
`;
