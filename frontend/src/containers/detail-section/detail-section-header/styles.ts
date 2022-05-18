import styled from "styled-components";

import { color, margins, fontSize, fontWeight } from "../../../design";

export const DetailSectionHeaderWrap = styled.header`
  display: flex;
  flex-flow: column nowrap;
  padding-bottom: ${margins.big};
  border-bottom: 1px solid ${color.grey};
  margin-bottom: ${margins.big};
`;

export const DetailSectionHeaderTop = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  h1 {
    font-size: 32px;
    font-weight: ${fontWeight.medium};
    line-hight: 40px;
  }
`;

export const DetailSectionHeaderDetails = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;
