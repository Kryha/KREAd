import { FC } from "react";
import { useMatch, useResolvedPath } from "react-router-dom";
import { text } from "../../assets";
import { color } from "../../design";
import { routes } from "../../navigation";

import { AboutText, AgoricText, FooterContainer, FooterWrapper, Link } from "./styles";


export const Footer: FC = () => {
  const resolved = useResolvedPath(routes.root);
  const match = useMatch({ path: resolved.pathname, end: true });
  const isLanding =  resolved.pathname === routes.root;

  return (
    <FooterWrapper isShop={!!match}>
      <FooterContainer>
        {!isLanding && (
          <Link to={routes.root}>
            <AboutText customColor={color.darkGrey}>{text.navigation.about}</AboutText>
          </Link>
        )}
        {/* TODO: UNCOMENT */}
        {/* <Link to={routes.privacy}>
          <PrivacyText customColor={color.darkGrey}>{text.navigation.privacyAndTerms}</PrivacyText>
        </Link> */}
        {/* TODO: link somewhere */}
        <AgoricText customColor={color.darkGrey}>{text.navigation.agoric2022}</AgoricText>
      </FooterContainer>
    </FooterWrapper>
  );
};
