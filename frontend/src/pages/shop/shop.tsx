import React, { FC } from "react";
import { BaseRoute, FadeInOut, Kado, Overlay } from "../../components";
import { ShopWrapper } from "./styles";
import { ItemsShop } from "./items-shop";
import { CharactersShop } from "./characters-shop";
import { useParams } from "react-router-dom";
import { Section } from "../../constants";
import { useKadoWidget } from "../../context/filter-context";
import { breakpoints } from "../../design";
import { useIsMobile } from "../../hooks";
import { ShopNavbar } from "../../components/shop-navbar/shop-navbar";

export const Shop: FC = () => {
  const { section } = useParams<{ section: Section }>();
  const { showWidget, toggleWidget } = useKadoWidget();
  const isMobile = useIsMobile(breakpoints.tablet);

  return (
    <BaseRoute isShop={true} sideNavigation={<></>}>
      {isMobile && <ShopNavbar />}
      <ShopWrapper>{section === "items" ? <ItemsShop /> : <CharactersShop />}</ShopWrapper>
      <FadeInOut show={showWidget}>
        <Kado show={showWidget} toggleWidget={toggleWidget} />
        <Overlay />
      </FadeInOut>
    </BaseRoute>
  );
};
