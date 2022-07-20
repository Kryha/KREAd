import "./App.css";
import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { AppRoutes } from "./navigation";
import { queryClient } from "./service";
import { AgoricStateProvider } from "./context/agoric";
// import { TestServiceUI } from "./service/test-service-ui";
import { CharacterStateProvider } from "./context/characters";
import { ItemStateProvider } from "./context/items";

function App() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>KREAd</title>
      </Helmet>
      <CharacterStateProvider>
        <ItemStateProvider>
          <AgoricStateProvider>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <AppRoutes />
                {/* <TestServiceUI /> */}
              </BrowserRouter>
            </QueryClientProvider>
          </AgoricStateProvider>
        </ItemStateProvider>
      </CharacterStateProvider>
    </>
  );
}

export default App;
