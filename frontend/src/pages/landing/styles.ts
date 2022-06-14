import styled from "styled-components";
import { BellIcon, CloseIcon, MenuIcon } from "../../assets";
import { SecondaryButton } from "../../components";

import { CharacterWrapper, ExpandButton } from "../../components/base-character/styles";
import { margins } from "../../design";

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
export const Close = styled(CloseIcon)`
  margin: 0px 0px 0px 11px !important;
  width: 12px;
  height: 12px;
`;

export const NotificationButton = styled(SecondaryButton)`
  padding: ${margins.mini};
  ${Close} {
    margin: 0px !important;
  }
`;

export const NotificationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: ${margins.small};
`;

export const Notification = styled(BellIcon)``;

export const Menu = styled(MenuIcon)`
  margin: 0px 0px 0px 11px !important;
`;
