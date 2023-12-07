import React, { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useNavigate } from "react-router-dom";

import { routes } from "./route-names";
import { CharacterBuy, CharacterSell, ConnectWallet, CreateCharacter, CreateCharacterMobile, Inventory, ItemBuy, ItemSell, Landing, LandingMobile, Onboarding, Privacy, Shop } from "../pages";
import { ErrorFallback, ErrorView, LoadingPage, MainContainer } from "../components";
import { AgoricStateProvider, useAgoricContext } from "../context/agoric";
import { UseWithContext } from "../context/wrapper";
import { MobileNotAvailable } from "../pages/mobile-not-available";
import { useIsMobile } from "../hooks";
import { breakpoints } from "../design";
import { OnboardingMobile } from "../pages/onboarding-mobile/onboarding-mobile";

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

  const { onboarding, connectWallet, character, createCharacter, ...desktopOnlyPaths } = routes;

  const desktopRoutes = <>
    <Route path={routes.connectWallet} element={<ConnectWallet />} />
    <Route path={routes.character} element={<Landing />} />
    <Route path={routes.createCharacter} element={<CreateCharacter />} />
    <Route path={`${routes.shop}/:section`} element={<Shop />} />
    <Route path={`${routes.inventory}/:section`} element={<Inventory />} />
    <Route path={`${routes.buyItem}/:id`} element={<ItemBuy />} />
    <Route path={`${routes.buyCharacter}/:id`} element={<CharacterBuy />} />
    <Route path={`${routes.sellItem}/:category/:name`} element={<ItemSell />} />
    <Route path={`${routes.sellCharacter}/:id`} element={<CharacterSell />} />
    <Route path="*" element={<ErrorView />} />
  </>
  const mobileRoutes = <>
    {Object.values(desktopOnlyPaths).map((path, index) => <Route path={path} element={<MobileNotAvailable />} key={index} />)}
    <Route path={routes.connectWallet} element={<ConnectWallet />} />
    <Route path={routes.character} element={<LandingMobile />} />
    <Route path={routes.createCharacter} element={<CreateCharacterMobile />} />
    <Route path="*" element={<ErrorView />} />
  </>
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => navigate(routes.character)}>
      <Routes>
       { isMobile ? mobileRoutes : desktopRoutes }
      </Routes>
    </ErrorBoundary>
  );
};

export const ExternalAppRoutes: FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile(breakpoints.tablet);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => navigate(routes.character)}>
      <MainContainer>
        <Routes>
          <Route path={routes.root} element={isMobile ? <OnboardingMobile /> : <Onboarding />} />
          <Route path={routes.privacy} element={<Privacy />} />
          <Route path="*" element={<InternalAppWrapper />} />
        </Routes>
      </MainContainer>
    </ErrorBoundary>
  );
};
