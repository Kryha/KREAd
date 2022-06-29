import styled from "@emotion/styled";
import { fadeIn, slideUpOpacity } from "../../components/atoms/animations";
import { color, margins } from "../../design";

interface ViewProps {
  width: number;
}

export const DetailSectionWrap = styled.section<ViewProps>`
  height: 80vh;
  background-color: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: 24px;
  max-width: 50%;
  padding: 0 ${margins.big} ${margins.big};
  display: flex;
  flex-flow: column nowrap;
  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
  opacity: 0;
  animation: ${slideUpOpacity} 0.6s cubic-bezier(0.4, 0, 0.2, 1) 500ms forwards;
`;

export const EmptyView = styled.section`
  height: 84vh;
  width: 100%;
  background-color: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: 24px;
`;
