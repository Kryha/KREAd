import styled from "styled-components";
import { CategoryButton } from "../../containers/detail-section/detail-section-header/styles";
import { color, fontSize, fontWeight, margins } from "../../design";

export const ActivityTableWrap = styled.section`
  display: flex;
  flex-flow: column nowrap;
  border: 1px solid ${color.grey};
  border-radius: ${margins.medium};
  width: 100%;
`;

export const Cell = styled.div`
  flex-grow: 1;
  width: 50px;
  ${CategoryButton} {
    color: ${color.darkGrey};
    border: 1p solid ${color.darkGrey};
  }
`;

export const HeaderWrap = styled.header`
  display: flex;
  border-bottom: 1px solid ${color.grey};
  padding: ${margins.medium} ${margins.medium} ${margins.small};
  margin-bottom: ${margins.small};
  justify-content: space-between;
  text-transform: capitalize;
  font-size: ${fontSize.subTitle};
  font-weight: ${fontWeight.regular};
  div {
  }
`;

export const RowWrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  padding: ${margins.small} 0;
  border-bottom: 1px solid ${color.grey};
  div {
    flex-grow: 1;
    width: 50px;
  }
`;

export const BodyWrap = styled.div`
  padding: ${margins.medium};
`;

export const FooterWrap = styled.footer`
  display: flex;
  justify-content: center;
  padding: ${margins.medium} 0;
`;
