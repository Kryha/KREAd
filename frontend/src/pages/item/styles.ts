import styled from "styled-components";
import { CharacterWrapper, ExpandButton } from "../../components/base-character/styles";
import { Menu } from "../../components/menu-card/styles";

interface ViewProps {
  width?: number;
  height?: number;
  position?: string;
}

/* eslint-disable indent */
export const ItemWrapper = styled.div <ViewProps>`
  over-flow: hidden;
  ${({ height }): string => `max-height: ${height};`};
  ${({ position }): string => {
    console.log(position);
    switch (position) {
      case "hair":
        return `
         ${CharacterWrapper} {
            top: 0px;
            left: 100px;
          };
        `;
      case "clothing":
        return `
         ${CharacterWrapper} {
            top: -800px;
            left: 100px;
          };
        `;
      default:
        return `
         ${CharacterWrapper} {
            top: -800px;
            left: 100px;
          };
      `;
    }
  }};

  ${ExpandButton} {
    display: none;
  }
  ${Menu} {
    position: absolute;
    z-index: 1000;
    top: 40px;
    right: 40px;
  }
`;
