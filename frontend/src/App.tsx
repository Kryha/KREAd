import './App.css';

import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from './navigation';
import { ServiceStateProvider } from './context/service';

const App = () => {
  return (
    <ServiceStateProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ServiceStateProvider>
  );
}

export default App;
