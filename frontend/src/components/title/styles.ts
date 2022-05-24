import styled from "styled-components";

import { color } from "../../design";
import { Label, PageTitle } from "../atoms";

export const PageTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  ${Label} {
    margin-right: 32px;
  }
  ${PageTitle} {
    margin-left: 32px;
  }
`;

export const Divider = styled.div`
  border: 0.5px solid ${color.grey};
  transform: rotate(90deg);
  width: 41px;
  margin-top: 20px;
`;
