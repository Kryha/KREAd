import styled from "@emotion/styled";
import { SecondaryButton } from "../../../components";

import { color, margins, fontWeight, fontSize, zIndex } from "../../../design";

export const DetailSectionHeaderWrap = styled.header`
  position: sticky;
  top: 0;
  z-index: ${zIndex.onTop};
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

export const CategoryButton = styled(SecondaryButton)`
  border-radius: 24px;
  color: ${color.darkGrey};
  padding: 3px 8px;
  cursor: default;
  font-size:  12px;
  line-height: 15px;
  text-transform: capitalize;
  border: 1px solid ${color.grey};
  &:hover {
    border: 1px solid ${color.grey};
    color: ${color.darkGrey};
  }
  &:active {
    border: 1px solid ${color.grey};
    color: ${color.darkGrey};
  }
  &:focus {
    border: 1px solid ${color.grey};
    color: ${color.darkGrey};
  }
`;
