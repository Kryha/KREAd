import styled from "styled-components";
import { color, margins } from "../../design";

export const DetailSectionWrap = styled.section`
  height: 80vh;
  background-color: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: 24px;
  max-width: 55%;
  padding: 0 ${margins.big} ${margins.big};
  display: flex;
  flex-flow: column nowrap;
  overflow-y: scroll;

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
