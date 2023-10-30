import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { breakpoints, color } from "../../design";
import { ButtonText } from "../atoms";

interface FooterProps {
  isShop: boolean;
}

export const FooterWrapper = styled.div<FooterProps>`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  z-index: 1000;
  flex-grow: 1;

  @media (max-width: ${breakpoints.tablet}) {
    align-items: center;
    justify-content: center;
  }
`;

export const FooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px 24px;
  gap: 20px;
`;

export const AboutText = styled(ButtonText)`
  &:hover {
    color: ${color.black};
  }
`;
export const PrivacyText = styled(AboutText)``;

export const AgoricText = styled(ButtonText)``;

export const Link = styled(NavLink)`
  text-decoration: none;
`;
