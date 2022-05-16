import styled from "styled-components";
import { color, margins } from '../../design'

export const DetailSectionWrap = styled.section`
  background-color: ${color.lightGrey};
  border: 1px solid ${color.grey};
  border-radius: 24px;
  max-width: 720px;
  padding: ${margins.big};
  display: flex;
  flex-flow: column nowrap;
  overflow-y: scroll;
`;
