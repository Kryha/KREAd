import styled from "styled-components";
import { color, margins } from "../../../design";

// interface ColorBulletProps {
//   hexCode: string;
// }

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

// export const ColorBullet = styled.svg`
//   width: 50px;
//   height: 50px;
//   border-radius: 50%;
//   border: 2px solid white;
//   background-color: ${hexCode};
// `;
