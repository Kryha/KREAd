import React, { FC, useMemo } from "react";

import { text } from "../../assets";
import { BaseRoute, SwitchSelector } from "../../components";
import { KreadContainer, ShopWrapper } from "./styles";
import { ItemsShop } from "./items-shop";
import { CharactersShop } from "./characters-shop";
import { useIsMobile, useViewport } from "../../hooks";
import { KreadIcon } from "../../components/logo/styles";
import { breakpoints } from "../../design";
import { useLocation, useParams } from "react-router-dom";
import { Section } from "../../constants";

export const Shop: FC = () => {
  const { width, height } = useViewport();
  const isMobile = useIsMobile(breakpoints.desktop);
  const { pathname } = useLocation();
  const { section } = useParams<{ section: Section }>();

  const pageSelector = useMemo(
    () => (
      <SwitchSelector
        buttonOneText={text.character.items}
        buttonTwoText={text.character.characters}
        selectedSection={section || "items"}
        path={pathname}
      />
    ),
    [section, pathname],
  );

  return (
    <BaseRoute sideNavigation={<></>}>
      <ShopWrapper>
        {section === "items" ? <ItemsShop pageSelector={pageSelector} /> : <CharactersShop pageSelector={pageSelector} />}
      </ShopWrapper>
      {!isMobile && (
        <KreadContainer height={height} width={width}>
          <KreadIcon />
        </KreadContainer>
      )}
    </BaseRoute>
  );
};
