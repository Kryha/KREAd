import styled from "styled-components";
import { CloseIcon } from "../../../assets";

export const DetailSectionHeaderNavigationWrap = styled.section`
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
`;

export const CloseButton = styled(CloseIcon)`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;
