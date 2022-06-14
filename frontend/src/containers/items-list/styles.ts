import styled from "@emotion/styled";

import { Label } from "../../components";
import { color, margins } from "../../design";

export const SortableListWrap = styled.section`
  width: 40%;
  display: flex;
  flex-flow: column nowrap;
  box-sizing: border-box;
`;

export const ListHeader = styled.header`
  z-index: 1;
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

export const ListContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  overflow-y: scroll;
  padding-top: ${margins.medium};
  gap: ${margins.small};
  padding-bottom: 160px;
`;
