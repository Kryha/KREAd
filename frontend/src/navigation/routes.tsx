import { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useNavigate } from "react-router-dom";

import { routes } from "./route-names";
import { Landing, Shop, Inventory, CreateCharacter, ItemBuy, CharacterBuy, ItemSell, CharacterSell, Onboarding, Privacy } from "../pages";
import { MainContainer, ErrorFallback, LoadingPage, ErrorView } from "../components";
import { ItemPage } from "../pages/item";
import { TestServiceUI } from "../service/test-service-ui";
import { AgoricStateProvider, useAgoricContext } from "../context/agoric";
import { UseWithContext } from "../context/wrapper";

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

  if (service.isLoading) return <LoadingPage spinner={false} />;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => navigate(routes.character)}>
      <MainContainer>
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

          <Route path={"/test"} element={<TestServiceUI />} />

          <Route path="*" element={<ErrorView />} />
        </Routes>
      </MainContainer>
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
