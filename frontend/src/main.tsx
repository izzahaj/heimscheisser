import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

import App from "./App.tsx";
import { store } from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Auth0Provider
      domain={process.env.AUTH0_DOMAIN || ""}
      clientId={process.env.AUTH0_CLIENT_ID || ""}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    > */}
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    {/* </Auth0Provider> */}
  </StrictMode>,
);
