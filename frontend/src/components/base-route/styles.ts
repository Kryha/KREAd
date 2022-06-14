import styled from "@emotion/styled";
import { margins } from "../../design";

export const TopbarContainer = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${margins.big};
`;

export const Box = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px;
`;
