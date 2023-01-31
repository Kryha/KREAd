import styled from "@emotion/styled";
import { EXTRA_LARGE_SCREEN_SIZE, LARGE_SCREEN_SIZE } from "../../constants";
import { color, margins } from "../../design";

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

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
  ${({ width }): string => {
    if (width <= 1300) {
      return "max-width: 47%;";
    } else if (width >= 1300 && width <= 1440) {
      return "max-width: 51%;";
    } else if (width >= 1440 && width <= LARGE_SCREEN_SIZE) {
      return "max-width: 52.7%;";
    } else if (width >= LARGE_SCREEN_SIZE && width <= EXTRA_LARGE_SCREEN_SIZE) {
      return "max-width: 53.7%;";
    } else {
      return "max-width: 55%;";
    }
  }}
`;

export const EmptyView = styled.section`
height: 84vh;
width: 100 %;
background - color: ${color.lightGrey};
border: 1px solid ${color.grey};
border - radius: 24px;
`;
