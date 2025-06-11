import "./index.css";
import "leaflet-geosearch/dist/geosearch.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Auth0Provider
      domain={process.env.AUTH0_DOMAIN || ""}
      clientId={process.env.AUTH0_CLIENT_ID || ""}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    > */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </Auth0Provider> */}
  </StrictMode>,
);
