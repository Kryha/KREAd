import styled from "@emotion/styled";
import { HorizontalDivider, Label } from "../../components";
import { FiltersContainer } from "../../components/filters/styles";
import { color, margins } from "../../design";

export const SortableListWrap = styled.section`
  width: 41.5%;
  min-width: 41.5%;
  display: flex;
  flex-flow: column nowrap;
  box-sizing: border-box;
  padding-bottom: 120px;
  ${HorizontalDivider} {
    margin-top: ${margins.nano};
  }
`;

export const ListHeader = styled.header`
  z-index: 1;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding-bottom: ${margins.medium};
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
  padding-bottom: 260px;
`;

export const CategoryContainer = styled.div`
  ${FiltersContainer} {
    width: 263.3px;
    min-width: 263.3px;
  }
`;
