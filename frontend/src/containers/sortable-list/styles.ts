import styled from "styled-components";
import { Label } from "../../components";
import { color, margins } from "../../design";

export const SortableListWrap = styled.section`
  display: flex;
  flex-flow: column nowrap;
  gap: ${margins.medium};
  box-sizing: border-box;
  overflow-y: scroll;
  margin-bottom: 160px;
`;

export const ListHeader = styled.header`
  z-index: 1;
  position: sticky;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding-bottom: ${margins.medium};
  border-bottom: 1px solid ${color.grey};
`;

export const SortContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px;
  align-items: center;
  ${Label} {
    color: ${color.black};
    margin-right: 10px;
  }
`;
