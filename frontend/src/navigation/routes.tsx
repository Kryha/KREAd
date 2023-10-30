import React, { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useNavigate } from "react-router-dom";

import { routes } from "./route-names";
import { CharacterBuy, CharacterSell, CreateCharacter, Inventory, ItemBuy, ItemSell, Landing, Onboarding, Privacy, Shop } from "../pages";
import { ErrorFallback, ErrorView, LoadingPage, MainContainer } from "../components";
import { AgoricStateProvider, useAgoricContext } from "../context/agoric";
import { UseWithContext } from "../context/wrapper";
import { MobileNotAvailable } from "../pages/mobile-not-available";
import { useIsMobile } from "../hooks";
import { breakpoints } from "../design";
import { ConnectWallet } from "../pages/connect-wallet";

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
    <MainContainer>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => navigate(routes.character)}>
        <Routes>
          <Route path={routes.connectWallet} element={<ConnectWallet />} />
          <Route path={routes.character} element={<Landing />} />
          <Route path={routes.createCharacter} element={<CreateCharacter />} />
          <Route path={`${routes.shop}/:section`} element={isMobile ? <MobileNotAvailable /> : <Shop />} />
          <Route path={`${routes.inventory}/:section`} element={isMobile ? <MobileNotAvailable /> : <Inventory />} />
          <Route path={`${routes.buyItem}/:id`} element={<ItemBuy />} />
          <Route path={`${routes.buyCharacter}/:id`} element={<CharacterBuy />} />
          <Route path={`${routes.sellItem}/:category/:name`} element={<ItemSell />} />
          <Route path={`${routes.sellCharacter}/:id`} element={<CharacterSell />} />
          <Route path="*" element={<ErrorView />} />
        </Routes>
      </ErrorBoundary>
    </MainContainer>
  );
};

export const ExternalAppRoutes: FC = () => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => navigate(routes.character)}>
      <Routes>
        <Route path={routes.root} element={<Onboarding />} />
        <Route path={routes.privacy} element={<Privacy />} />
        <Route path="*" element={<InternalAppWrapper />} />
      </Routes>
    </ErrorBoundary>
  );
};
