import styled from "@emotion/styled";
import { PageTitle } from "../../../components";
import { breakpoints } from "../../../design";

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

  @media screen and (max-width: ${breakpoints.tablet}) {
    ${PageTitle} {
      font-size: 16px;
    }
  }
`;

export const ModeAnimationContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
