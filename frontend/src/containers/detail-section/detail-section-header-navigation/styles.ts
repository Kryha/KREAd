import styled from "@emotion/styled";
import { PriceContainer } from "../../../components/price-in-run/styles";
import { margins } from "../../../design";

export const DetailSectionHeaderNavigationWrap = styled.section`
  display: flex;
  flex-flow: row nowrap;
  gap: ${margins.mini};
  ${PriceContainer} {
    margin-right: ${margins.mini};
  }
`;
