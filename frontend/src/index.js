import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// your existing pages
import UnifiedDashboard from "./components/unified/UnifiedDashboard";
import BankingApp from "./components/banking/Main";
import EcommerceApp from "./components/ecommerce/Main";
import TelecomApp from "./components/telecom/Main";
import NetflixApp from './components/netflix/main'
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/unified" element={<UnifiedDashboard />} />
      <Route path="/banking" element={<BankingApp />} />
      <Route path="/ecommerce" element={<EcommerceApp />} />
      <Route path="/telecom" element={<TelecomApp/>}/>
      <Route path="/netflix" element={<NetflixApp/>}/>
    </Routes>
  </BrowserRouter>
);