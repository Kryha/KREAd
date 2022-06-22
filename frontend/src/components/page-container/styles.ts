import styled from "@emotion/styled";
import { margins } from "../../design";

export const PageWrap = styled.section`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  gap: ${margins.big};
  box-sizing: border-box;
  padding: 0 40px;
  overflow: hidden;
  margin-bottom: 40px;
`;
