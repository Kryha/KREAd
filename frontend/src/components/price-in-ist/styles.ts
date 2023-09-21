import styled from "@emotion/styled";

import { color, margins, zIndex } from "../../design";

export const PriceContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: ${zIndex.background};
  width: 100%;
`;

export const Diamond = styled.div`
  width: 10px;
  height: 10px;
  max-width: 10px;
  max-height: 10px;
  min-width: 10px;
  min-height: 10px;
  background: ${color.black};
  transform: rotate(45deg);
  margin: 0 ${margins.mini};
`;
