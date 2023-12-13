import React, { FC, useState } from "react";
import { useLocation, useMatch, useResolvedPath } from "react-router-dom";
import { text } from "../../assets";
import { breakpoints, color } from "../../design";
import { routes } from "../../navigation";
import { AgoricText, FooterContainer, FooterWrapper, Link, PrivacyText } from "./styles";
import { NetworkSelect } from "../network-selector/network-select";
import { useNetworkConfig } from "../../hooks/useNetwork";
import { getLabelForNetwork, NetworkSelector } from "../network-selector/network-selector";
import { networkOptions } from "../../constants";
import { useIsMobile } from "../../hooks";

export const Footer: FC = () => {
  const resolvedShop = useResolvedPath(routes.shop);
  const matchShop = useMatch({ path: resolvedShop.pathname, end: true });
  const { network, setNetworkValue } = useNetworkConfig();

  const location = useLocation();
  const pathsWithNetworkSelector = [routes.root, routes.connectWallet];

  const label = getLabelForNetwork(network);

  const [filterId, setFilterId] = useState("");

  const openFilter = (id: string) => {
    setFilterId(id !== filterId ? id : "");
  };

  const isMobile = useIsMobile(breakpoints.tablet);

  return (
    <FooterWrapper isShop={!!matchShop}>
      { pathsWithNetworkSelector.includes(location.pathname as any) && !isMobile &&
        <NetworkSelector label={label} openNetworkSelector={openFilter} id={filterId} hasValue={!!network}>
          <NetworkSelect label={network} onChange={setNetworkValue} options={networkOptions} />
        </NetworkSelector>
      }
      <FooterContainer>
        <Link to={routes.privacy}>
          <PrivacyText customColor={color.darkGrey}>{text.navigation.privacyAndTerms}</PrivacyText>
        </Link>
        <Link to={routes.root}>
          <AgoricText customColor={color.darkGrey}>{text.navigation.agoricCopyright(new Date().getFullYear())}</AgoricText>
        </Link>
      </FooterContainer>
    </FooterWrapper>
  );
};
