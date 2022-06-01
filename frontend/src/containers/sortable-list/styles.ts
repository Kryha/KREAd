import styled from "styled-components";
import { margins } from "../../design";

export const SortableListWrap = styled.section`
  display: flex;
  flex-flow: column nowrap;
  gap: ${margins.medium};
  box-sizing: border-box;
  overflow-y: scroll;
  margin-bottom: 160px;
`;
