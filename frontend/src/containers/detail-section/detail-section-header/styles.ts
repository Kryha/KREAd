import styled from "@emotion/styled";
import { OutlinedButton } from "../../../components";

import { color, margins, fontWeight, fontSize } from "../../../design";

export const DetailSectionHeaderWrap = styled.header`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: ${color.lightGrey};
  display: flex;
  flex-flow: column nowrap;
  padding: ${margins.big} 0 ${margins.big};
  border-bottom: 1px solid ${color.grey};
  margin-bottom: ${margins.big};
`;

export const DetailSectionHeaderTop = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
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
  font-size: ${fontSize.extraSmall};
  font-weight: ${fontWeight.medium};
`;

export const CategoryButton = styled(OutlinedButton)`
  color: ${color.darkGrey};
  padding: 3px 8px;
  cursor: default;
`;
