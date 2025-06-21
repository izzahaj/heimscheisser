import "./App.css";

import { Route, Routes } from "react-router";

import { MainLayout } from "./common/layouts";
import MinimalLayout from "./common/layouts/MinimalLayout";
import { Toaster } from "./components/ui/sonner";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" closeButton duration={3000} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route element={<MinimalLayout />}>
          <Route path="/map" element={<MapPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
