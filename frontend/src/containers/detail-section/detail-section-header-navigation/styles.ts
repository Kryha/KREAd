import styled from "@emotion/styled";
import { PriceContainer } from "../../../components/price-in-ist/styles";
import { margins } from "../../../design";

export const DetailSectionHeaderNavigationWrap = styled.section`
  display: flex;
  flex-flow: row nowrap;
  gap: ${margins.mini};
  align-items: flex-start;
  ${PriceContainer} {
    margin-right: ${margins.mini};
  }
`;
