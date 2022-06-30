import { FC } from "react";
import { useMatch, useResolvedPath } from "react-router-dom";
import { text } from "../../assets";
import { color } from "../../design";
import { routes } from "../../navigation";

import { AboutText, AgoricText, FooterContainer, FooterWrapper, PrivacyText, Link } from "./styles";


export const Footer: FC = () => {
  const resolved = useResolvedPath(routes.shop);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <FooterWrapper isShop={!!match}>
      <FooterContainer>
        <Link to={routes.about}>
          <AboutText customColor={color.darkGrey}>{text.navigation.about}</AboutText>
        </Link>
        <Link to={routes.privacy}>
          <PrivacyText customColor={color.darkGrey}>{text.navigation.privacyAndTerms}</PrivacyText>
        </Link>
        {/* TODO: link somewhere */}
        <AgoricText customColor={color.darkGrey}>{text.navigation.agoric2022}</AgoricText>
      </FooterContainer>
    </FooterWrapper>
  );
};
