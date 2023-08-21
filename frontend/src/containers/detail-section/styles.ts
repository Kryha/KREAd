import styled from "@emotion/styled";
import { breakpoints, color, margins } from "../../design";

interface ViewProps {
  width: number;
}

export const DetailSectionWrap = styled.div<ViewProps>`
  height: 80vh;
  background-color: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: 24px;
  padding: 0 ${margins.big} ${margins.big};
  display: flex;
  flex-flow: column nowrap;
  overflow-y: scroll;
  max-width: ${breakpoints.desktop};

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }

  @media only screen and (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
    width: 50%;
  }
`;

export const EmptyView = styled.section`
  height: 84vh;
  width: 100%;
  background-color: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: 24px;
`;
