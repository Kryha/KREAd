import styled from "styled-components";
import { BoldLabel } from "../atoms";

export const SectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  margin 40px 0px;
  ${BoldLabel} {
    transform: rotate(-90deg);
    margin-right: 16px;
  }
`;
