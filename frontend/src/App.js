import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import POSPage from "./pages/POSPage";
import ManagerPage from "./pages/ManagerPage";
import LoyaltyPage from "./pages/LoyaltyPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Loyalty Page */}
        <Route path="/loyalty" element={<LoyaltyPage />} />

        {/* POS System */}
        <Route path="/pos" element={<POSPage />} />

        {/* Manager Page */}
        <Route path="/manager" element={<ManagerPage />} />
      </Routes>
    </Router>
  );
};

export default App;
