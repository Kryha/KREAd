import styled from "styled-components";

import { CharacterWrapper, ExpandButton } from "../../view/base-character/styles";

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
