import styled from "@emotion/styled";
import { CharacterWrapper, ExpandButton } from "../../components/base-character/styles";
import { Menu } from "../../components/menu-card/styles";
import { SMALL_SCREEN_SIZE, EXTRA_LARGE_SCREEN_SIZE } from "../../constants";
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
  ${({ position, width }): string => {
    switch (position) {
      case "hair":
        return "top: 0px;";
      case "clothing":
        if (width <= SMALL_SCREEN_SIZE) {
          return "top: -550px;";
        }
        if (width >= EXTRA_LARGE_SCREEN_SIZE) {
          return "top: -1100px;";
        }
        else {
          return "top: -800px;";
        }
      default:
        if (width <= SMALL_SCREEN_SIZE) {
          return "top: -550px;";
        }
        if (width >= EXTRA_LARGE_SCREEN_SIZE) {
          return "top: -800px;";
        }
        else {
          return "top: -600px;";
        }
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
