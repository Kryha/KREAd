import { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useNavigate } from "react-router-dom";

import { routes } from "./route-names";
import { Landing } from "../components";
import { MainContainer, ErrorFallback } from "../view";

export const AppRoutes: FC = () => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => navigate(routes.root)}>
      <MainContainer>
        <Routes>
          <Route path={routes.root} element={<Landing />} />
        </Routes>
      </MainContainer>
    </ErrorBoundary>
  );
};
