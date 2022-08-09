import styled from "@emotion/styled";

import { HorizontalDivider, Label } from "../../components";
import { fadeUp } from "../../components/atoms/animations";
import { FiltersContainer } from "../../components/filters/styles";
import { color, margins } from "../../design";

export const SortableListWrap = styled.section`
  width: 40%;
  display: flex;
  flex-flow: column nowrap;
  box-sizing: border-box;
  padding-bottom: 120px;
  ${HorizontalDivider} {
    margin-top: ${margins.nano};
  }
  animation: ${fadeUp} 1.2s ease-out 0s forwards;
  opacity: 0;
  transform: translate3d(0, 1rem, 0);
`;

export const ListHeader = styled.header`
  z-index: 1;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding-bottom: ${margins.small};
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

export const ColorContainer = styled.div`
  ${FiltersContainer} {
    width: 92px;
    min-width: 92px;
  }
`;

export const BaseFilterContainer = styled.div`
  display: flex;
  gap: 8px;
`;
