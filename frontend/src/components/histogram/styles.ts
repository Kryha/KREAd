import styled from "@emotion/styled";
import { color } from "../../design";

export const HistogramWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  height: 100px;
  width: 278px;
  margin-bottom: 24px;
`;

export const Bar = styled.div`
  height: 100%;
  width: 100%; /* Adjust the bar width as needed */
  margin: 0 4px; /* Adjust the margin between bars as needed */
  background-color: ${color.black};
  border-radius: 4px;
`;
