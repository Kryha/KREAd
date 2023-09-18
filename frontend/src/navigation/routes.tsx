import React, { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useNavigate } from "react-router-dom";

import { routes } from "./route-names";
import {
  CharacterBuy,
  CharacterSell,
  CreateCharacter,
  Inventory,
  ItemBuy,
  ItemPage,
  ItemSell,
  Landing,
  Onboarding,
  Privacy,
  Shop,
} from "../pages";
import { ErrorFallback, ErrorView, LoadingPage, MainContainer } from "../components";

import { TestServiceUI } from "../service/test-service/test-service-ui";
import { AgoricStateProvider, useAgoricContext } from "../context/agoric";
import { UseWithContext } from "../context/wrapper";
import { isDevelopmentMode } from "../constants";
import { MobileNotAvailable } from "../pages/mobile-not-available";
import { useIsMobile } from "../hooks";
import { breakpoints } from "../design";

export const InternalAppWrapper = () => {
  return (
    <AgoricStateProvider>
      <UseWithContext>
        <InternalAppRoutes />
      </UseWithContext>
    </AgoricStateProvider>
  );
};

export const InternalAppRoutes: FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile(breakpoints.tablet);
  const [service] = useAgoricContext();

  if (service.isLoading) return <LoadingPage spinner={false} />;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => navigate(routes.character)}>
      <Routes>
        <Route path={routes.root} element={<Onboarding />} />
        <Route path={routes.character} element={<Landing />} />
        <Route path={routes.createCharacter} element={<CreateCharacter />} />
        <Route path={`${routes.items}/:category`} element={isMobile ? <MobileNotAvailable /> : <ItemPage />} />
        <Route path={`${routes.shop}/:section`} element={isMobile ? <MobileNotAvailable /> : <Shop />} />
        <Route path={`${routes.inventory}/:section`} element={isMobile ? <MobileNotAvailable /> : <Inventory />} />
        <Route path={`${routes.buyItem}/:id`} element={isMobile ? <MobileNotAvailable /> : <ItemBuy />} />
        <Route path={`${routes.buyCharacter}/:id`} element={isMobile ? <MobileNotAvailable /> : <CharacterBuy />} />
        <Route path={`${routes.sellItem}/:category/:name`} element={isMobile ? <MobileNotAvailable /> : <ItemSell />} />
        <Route path={`${routes.sellCharacter}/:id`} element={isMobile ? <MobileNotAvailable /> : <CharacterSell />} />

        {isDevelopmentMode && <Route path={`${routes.test}`} element={<TestServiceUI />} />}

        <Route path="*" element={<ErrorView />} />
      </Routes>
    </ErrorBoundary>
  );
};

export const ExternalAppRoutes: FC = () => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => navigate(routes.character)}>
      <MainContainer>
        <Routes>
          <Route path={routes.root} element={<Onboarding />} />
          <Route path={routes.privacy} element={<Privacy />} />
          <Route path="*" element={<InternalAppWrapper />} />
        </Routes>
      </MainContainer>
    </ErrorBoundary>
  );
};
