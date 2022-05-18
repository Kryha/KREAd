import styled from "styled-components";

import { color } from '../../../design';

export const DetailSectionHeaderWrap = styled.header`
  display: flex;
  flex-flow: column nowrap;
  border-bottom: 1px solid ${color.grey}`;

export const DetailSectionHeaderTop = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

export const DetailSectionHeaderDetails = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;
