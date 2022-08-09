import styled from "@emotion/styled";
import { CharacterWrapper, ExpandButton } from "../../components/base-character/styles";
import { Menu } from "../../components/menu-card/styles";
import { margins } from "../../design";

interface ViewProps {
  width: number;
  height?: number;
  position?: string;
}

/* eslint-disable indent */
export const ItemWrapper = styled.div<ViewProps>`
  overflow: hidden;
  ${({ height }): string => `max-height: ${height}px;`};
  ${CharacterWrapper} {
    left: 10%;
  ${({ position }): string => {
    switch (position) {
      case "hair":
        return "top: 0px;";
      case "clothing":
        return "top: -120%;";
      default:
        return "top: -75%;";
    }
  }};
  }

  ${ExpandButton} {
    display: none;
  }
  ${Menu} {
    position: absolute;
    z-index: 1000;
    top: ${margins.big};
    right: ${margins.big};
  }
`;
