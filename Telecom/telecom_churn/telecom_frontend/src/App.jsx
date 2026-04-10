import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomerForm from "./components/CustomerForm";
import ResultCard from "./components/ResultCard";
import CustomerTable from "./components/CustomerTable";
import "./index.css";

// 🟢 Home Component
function Home({ setResult, result }) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Customer Churn Dashboard</h1>

      <CustomerForm setResult={setResult} />
      <ResultCard result={result} />
    </div>
  );
}

// 🟢 Customers Page
function Customers() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Customer List</h1>

      <button className="nav-btn" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>

      <CustomerTable />
    </div>
  );
}

// 🟢 Main App
function App() {
  const [result, setResult] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Home setResult={setResult} result={result} />} />
      <Route path="/customers" element={<Customers />} />
    </Routes>
  );
}

export default App;