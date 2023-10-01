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
  padding: 0 ${margins.medium} ${margins.medium};
  display: flex;
  flex-flow: column nowrap;
  overflow-y: scroll;
  max-width: ${breakpoints.tablet};

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const EmptyView = styled.section`
  height: 84vh;
  width: 100%;
  background-color: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: 24px;
`;
