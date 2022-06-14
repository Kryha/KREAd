import "./App.css";
import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "./navigation";
import { queryClient } from "./service";
import { ServiceStateProvider } from "./context/service";
import { TestServiceUI } from "./service/test-service-ui";

function App() {
  return (
    <ServiceStateProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* <AppRoutes /> */}
          <TestServiceUI />
        </BrowserRouter>
      </QueryClientProvider>
    </ServiceStateProvider>
  );
}

export default App;
