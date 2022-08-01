import "./App.css";
import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { ExternalAppRoutes } from "./navigation";
import { queryClient } from "./service";

function App() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>KREAd</title>
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ExternalAppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
