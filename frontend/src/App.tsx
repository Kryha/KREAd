import "./App.css";
import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "./navigation";
import { queryClient } from "./service";
import { AgoricStateProvider } from "./context/agoric";
import { TestServiceUI } from "./service/test-service-ui";
import { CharacterStateProvider } from "./context/characters";

function App() {
  return (
    <CharacterStateProvider>
      <AgoricStateProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRoutes />
            {/* <TestServiceUI /> */}
          </BrowserRouter>
        </QueryClientProvider>
      </AgoricStateProvider>
    </CharacterStateProvider>
  );
}

export default App;
