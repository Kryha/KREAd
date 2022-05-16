import './App.css';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from './navigation';
import { queryClient } from "./service";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
