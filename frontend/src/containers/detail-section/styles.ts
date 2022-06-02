import styled from "styled-components";
import { color, margins } from "../../design";

export const DetailSectionWrap = styled.section`
  background-color: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: 24px;
  max-width: 55%;
  padding: ${margins.big};
  padding-bottom: 100px;
  display: flex;
  flex-flow: column nowrap;
  overflow-y: scroll;
`;

export const EmptyView = styled.section`
  width: 100%;
  background-color: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: 24px;
`;
