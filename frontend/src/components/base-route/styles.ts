import styled from "@emotion/styled";
import { margins, zIndex } from "../../design";

export const TopbarContainer = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: ${margins.big};
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
`;
