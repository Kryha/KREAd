import { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useNavigate } from "react-router-dom";

import { routes } from "./route-names";
import {
  CharacterBuy,
  CharacterSell,
  CreateCharacter,
  DownloadCharacter,
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
import { DevelopmentMode } from "../service/test-service/development-mode";

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
  const [service] = useAgoricContext();

  // if (service.isLoading) return <LoadingPage spinner={false} />;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => navigate(routes.character)}>
      <Routes>
        <Route path={routes.root} element={<Onboarding />} />
        <Route path={routes.character} element={<Landing />} />
        <Route path={`${routes.items}/:category`} element={<ItemPage />} />
        <Route path={routes.shop} element={<Shop />} />
        <Route path={routes.inventory} element={<Inventory />} />
        <Route path={routes.createCharacter} element={<CreateCharacter />} />
        <Route path={`${routes.buyItem}/:id`} element={<ItemBuy />} />
        <Route path={`${routes.buyCharacter}/:id`} element={<CharacterBuy />} />
        <Route path={`${routes.sellItem}/:id`} element={<ItemSell />} />
        <Route path={`${routes.sellCharacter}/:id`} element={<CharacterSell />} />
        <Route path={routes.downloadCharacter} element={<DownloadCharacter />} />

        {isDevelopmentMode && <Route path={"/test"} element={<TestServiceUI />} />}

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
        <DevelopmentMode />
        <Routes>
          <Route path={routes.root} element={<Onboarding />} />
          <Route path={routes.privacy} element={<Privacy />} />
          <Route path="*" element={<InternalAppWrapper />} />
        </Routes>
      </MainContainer>
    </ErrorBoundary>
  );
};
