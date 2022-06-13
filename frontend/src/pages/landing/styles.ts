import styled from "styled-components";
import { CloseIcon, MenuIcon } from "../../assets";

import { CharacterWrapper, ExpandButton } from "../../components/base-character/styles";

interface ImageProps {
  isZoomed?: boolean;
}

export const LandingContainer = styled.div <ImageProps>`
${({ isZoomed }): string => {
    return isZoomed
      ? `
     ${CharacterWrapper} {
        left: 20%;
        top: -380px;
      }
      ${ExpandButton} {
        bottom: 17%;
        left: 53%;
      }
        `
      : "";
  }};
`;

export const Menu = styled(MenuIcon)`
  margin: 0px 0px 0px 11px !important;
`;

export const Close = styled(CloseIcon)`
  margin: 0px 0px 0px 11px !important;
`;
