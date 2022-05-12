// import 'ses';
import '@endo/init';


import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// lockdown();
// lockdown({
//         __allowUnsafeMonkeyPatching__: 'unsafe',
//         errorTaming: 'unsafe',
//         overrideTaming: 'severe',
//         consoleTaming: 'unsafe',
// });
      
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
