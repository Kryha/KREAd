import styled from "@emotion/styled";
import { breakpoints, margins } from "../../design";
import { DetailSectionWrap } from "../../containers/detail-section/styles";

export const PageWrap = styled.section`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: stretch;
  align-items: stretch;
  overflow: hidden;
  width: 100%;
  height: 100%;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    height: 100vh;
    gap: ${margins.big};
    padding: 0 40px;
    overflow: hidden;

    ${DetailSectionWrap} {
      height: 70vh;
    }
  }
`;
