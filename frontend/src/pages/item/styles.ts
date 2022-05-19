import styled from "styled-components";
import { CharacterWrapper, ExpandButton } from "../../components/base-character/styles";
import { Menu } from "../../components/menu-card/styles";

interface ViewProps {
  width?: number;
  height?: number;
}

export const ItemWrapper = styled.div <ViewProps>`
  over-flow: hidden;
  ${({ height }): string => `max-height: ${height};`};
  ${CharacterWrapper} {
    top: -1050px;
    left: -100px;
  };
  ${ExpandButton} {
    bottom: 19%;
    left: 57%;
  }
  ${Menu} {
    position: absolute;
    z-index: 1000;
    top: 40px;
    right: 40px;
  }
`;
