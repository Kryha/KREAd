import { BrowserRouter } from "react-router-dom";
import { ServiceStateProvider } from "./context/service";
import { AppRoutes } from './navigation';

function App() {
  return (
    <ServiceStateProvider>
      <BrowserRouter>
        <AppRoutes />
        <h1>CB</h1>
      </BrowserRouter>
    </ServiceStateProvider>
    
  );
};

export default App;
