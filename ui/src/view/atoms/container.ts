import styled from "styled-components";

import { color, margins } from "../../design";
import { Label } from "./text";

export const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${margins.medium};
  align-items: center;
  width: 100%;
  text-align: center;
`;

export const Badge = styled.span`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: ${margins.nano} ${margins.mini};
  background: ${color.lightGrey};
  border: 1px solid ${color.grey};
  box-sizing: border-box;
  border-radius: ${margins.medium};
  ${Label} {
    margin: 0px 10px;
  }
`;
