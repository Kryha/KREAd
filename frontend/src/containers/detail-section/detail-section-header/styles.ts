import styled from "styled-components";
import { OutlinedButton } from "../../../components";

import { color, margins, fontWeight, fontSize } from "../../../design";

export const DetailSectionHeaderWrap = styled.header`
  position: relative;
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
  margin-bottom: ${margins.small};
`;

export const DetailSectionHeaderDetails = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${margins.mini};
  align-items: baseline;
`;

export const DetailSectionHeaderId = styled.p`
  display: inline-block;
  color: ${color.black};
  font-size ${fontSize.extraSmall};
  font-weight: ${fontWeight.medium};
`;

export const CategoryButton = styled(OutlinedButton)`
  color: ${color.grey};
  padding: 3px 8px;
`;
