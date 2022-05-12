import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from './navigation';
import { ServiceStateProvider } from './context/service';

const App = () => {
  return (
    <ServiceStateProvider>
      <BrowserRouter>
        <AppRoutes />
        <h1>CB</h1>
      </BrowserRouter>
    </ServiceStateProvider>
  );
}

export default App;
