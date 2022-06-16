import styled from "@emotion/styled";
import { CloseIcon, MenuIcon } from "../../assets";

import { TopbarContainer } from "../../components/base-route/styles";

interface ImageProps {
  isZoomed?: boolean;
}

export const LandingContainer = styled.div<ImageProps>``;

export const Menu = styled(MenuIcon)`
  margin: 0px 0px 0px 11px !important;
  width: 12px;
`;

export const Close = styled(CloseIcon)`
  margin: 0px 0px 0px 11px !important;
  width: 12px;
`;

interface BaseView {
  hideView: boolean;
}

export const BaseWrapper = styled.div<BaseView>`
  ${({ hideView }): string => {
    return hideView
      ? `
      ${TopbarContainer} {
       display: none;
      }
        `
      : "";
  }};
`;
