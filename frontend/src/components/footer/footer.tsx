import { FC } from "react";
import { useMatch, useResolvedPath } from "react-router-dom";
import { text } from "../../assets";
import { color } from "../../design";
import { routes } from "../../navigation";

import { AboutText, AgoricText, FooterContainer, FooterWrapper, Link, PrivacyText } from "./styles";


export const Footer: FC = () => {
  const resolvedShop = useResolvedPath(routes.shop);
  const resolvedLanding = useResolvedPath(routes.root);
  const matchShop = useMatch({ path: resolvedShop.pathname, end: true });
  const matchLanding = useMatch({ path: resolvedLanding.pathname, end: true });

  return (
    <FooterWrapper isShop={!!matchShop}>
      <FooterContainer>
        {!matchLanding && (
          <Link to={routes.root}>
            <AboutText customColor={color.darkGrey}>{text.navigation.about}</AboutText>
          </Link>
        )}
        <Link to={routes.privacy}>
          <PrivacyText customColor={color.darkGrey}>{text.navigation.privacyAndTerms}</PrivacyText>
        </Link>
        <AgoricText customColor={color.darkGrey}>{text.navigation.agoric2022}</AgoricText>
      </FooterContainer>
    </FooterWrapper>
  );
};
