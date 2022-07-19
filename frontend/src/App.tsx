import "./App.css";
import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "./navigation";
import { queryClient } from "./service";
import { AgoricStateProvider } from "./context/agoric";
import { CharacterStateProvider } from "./context/characters";
import { ItemStateProvider } from "./context/items";

function App() {
  return (
    <ItemStateProvider>
      <CharacterStateProvider>
        <AgoricStateProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </QueryClientProvider>
        </AgoricStateProvider>
      </CharacterStateProvider>
    </ItemStateProvider>
  );
}

export default App;
