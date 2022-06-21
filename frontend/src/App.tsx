import "./App.css";
import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "./navigation";
import { queryClient } from "./service";
import { ServiceStateProvider } from "./context/service";
import { TestServiceUI } from "./service/test-service-ui";
import { CharacterStateProvider } from "./context/characters";

function App() {
  return (
    <CharacterStateProvider>
      <ServiceStateProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRoutes />
            {/* <TestServiceUI /> */}
          </BrowserRouter>
        </QueryClientProvider>
      </ServiceStateProvider>
    </CharacterStateProvider>
  );
}

export default App;
