import { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useNavigate } from "react-router-dom";

import { routes } from "./route-names";
import { Landing, Shop, Inventory, CreateCharacter, ItemBuy, CharacterBuy, ItemSell, CharacterSell } from "../pages";
import { MainContainer, ErrorFallback } from "../components";
import { Item } from "../pages/item";

export const AppRoutes: FC = () => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => navigate(routes.root)}>
      <MainContainer>
        <Routes>
          <Route path={routes.root} element={<Landing />} />
          <Route path={`${routes.items}/:category`} element={<Item />} />
          <Route path={routes.shop} element={<Shop />} />
          <Route path={routes.inventory} element={<Inventory />} />
          <Route path={routes.createCharacter} element={<CreateCharacter />} />

          <Route path={`${routes.buyItem}/:id`} element={<ItemBuy />} />
          <Route path={`${routes.buyCharacter}/:id`} element={<CharacterBuy />} />

          <Route path={`${routes.sellItem}/:id`} element={<ItemSell />} />
          <Route path={`${routes.sellCharacter}/:id`} element={<CharacterSell />} />
        </Routes>
      </MainContainer>
    </ErrorBoundary>
  );
};
