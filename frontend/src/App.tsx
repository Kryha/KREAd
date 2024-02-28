import "./installSesLockdown";
import "./reset.css";
import "./index.css";

import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { ExternalAppRoutes } from "./navigation";
import { queryClient } from "./service";

function App() {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <meta charSet="utf-8" />
          <title>KREAd</title>
        </Helmet>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ExternalAppRoutes />
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
