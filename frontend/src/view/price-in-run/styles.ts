import styled from "styled-components";

import { color, margins } from "../../design";

export const PriceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Diamond = styled.div`
  width: 10px;
  height: 10px;
  background: ${color.black};
  transform: rotate(45deg);
  margin: 0px ${margins.small};
`;
