import styled from "@emotion/styled";
import { disappear, fadeIn } from "../../../components";
import { color } from "../../../design";

export const DetailsWrapper = styled.div`
  animation: ${disappear}, ${fadeIn};
  animation-duration: 0.6s, 0.8s;
  animation-delay: 0s, 0.6s;

  background-color: ${color.lightGrey};
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
`;

interface Props {
  height: number;
}

export const DetailsContainer = styled.div<Props>`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  gap: 8px;
  padding: 16px;
  ${({ height }): string => `height: ${height - 250}px;`};
  ::-webkit-scrollbar {
    display: none;
`;

export const DetailsActions = styled.div`
  display: flex;
  gap: 8px;
  flex: 1 1 auto;
  justify-content: flex-end;
`;
export const DetailsHeader = styled.div`
  display: flex;
  flex-direction: column;
`;
export const DetailsHeaderTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const DetailsSectionContent = styled.div``;
