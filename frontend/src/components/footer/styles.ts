import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { color } from "../../design";
import { ButtonText } from "../atoms";

interface FooterProps {
  isShop: boolean;
}

export const FooterWrapper = styled.div<FooterProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 16px;
  margin-top: 16px;
  align-items: flex-start;
  width: 100%;
  z-index: 1000;
  border-radius: 100px;
`;

export const FooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 24px;
  gap: 20px;
`;

export const AboutText = styled(ButtonText)`
  &:hover {
    color: ${color.black};
  }
`;
export const PrivacyText = styled(AboutText)``;

export const AgoricText = styled(AboutText)``;

export const Link = styled(NavLink)`
  text-decoration: none;
`;
