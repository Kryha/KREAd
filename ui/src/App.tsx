import { BrowserRouter } from "react-router-dom";
import { ServiceStateProvider } from "./context/service";
import { AppRoutes } from './navigation';
import { TestServiceUI } from "./service/test-service-ui";

function App() {
  return (
    <ServiceStateProvider>
      <BrowserRouter>
        {/* <AppRoutes /> */}
        <TestServiceUI />
      </BrowserRouter>
    </ServiceStateProvider>
    
  );
};

export default App;
