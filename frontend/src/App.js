import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import POSPage from "./pages/POSPage";
import LoyaltyPage from "./pages/LoyaltyPage";
import ManagerPage from "./pages/ManagerPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/pos" element={<POSPage />} />
      <Route path="/loyalty" element={<LoyaltyPage />} />
      <Route path="/manager" element={<ManagerPage />} />
    </Routes>
  );
};

export default App;
