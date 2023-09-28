import styled from "@emotion/styled";
import { breakpoints, margins } from "../../design";

export const PageWrap = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100vh;
  gap: ${margins.big};
  padding: 0 40px;
  overflow: hidden;

  @media screen and (max-width: ${breakpoints.mobile}) {
    margin: 0;
    padding: 0;
  }
`;
