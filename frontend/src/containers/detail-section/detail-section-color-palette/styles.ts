import styled from "@emotion/styled";
import { color, margins } from "../../../design";

export const DetailSectionColorPaletteWrap = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: ${margins.medium};
  svg {
    border-radius: 50%;
    padding: 2px;
    border: 1px solid ${color.grey};
  }
`;
