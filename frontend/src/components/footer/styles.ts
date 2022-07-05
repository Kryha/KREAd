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
  justify-content: flex-end;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  z-index: 1000;
  ${({ isShop }): string => {
    return isShop
      ? `
      background: linear-gradient(294.15deg, #FAFAFA 10.87%, #FAFAFA 41.93%);
      &:hover {
        background: linear-gradient(294.15deg, #FAFAFA 10.87%, #FAFAFA 41.93%);
      }
        `
      : `
      background: linear-gradient(294.15deg, #FAFAFA 10.87%, rgba(250, 250, 250, 0) 41.93%);
      &:hover {
        background: linear-gradient(294.15deg, #FAFAFA 10.87%, #FAFAFA 41.93%);
      }
      `;
  }};

  border-radius: 100px;
`;

export const FooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px 40px;
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
