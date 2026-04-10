import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomerForm from "./CustomerForm";
import ResultCard from "./ResultCard";
import CustomerTable from "./CustomerTable";

// 🔥 COMMON STYLES
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px"
  },

  card: {
    width: "100%",
    maxWidth: "800px",
    background: "rgba(0,0,0,0.5)",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)"
  },

  title: {
    fontSize: "32px",
    marginBottom: "20px",
    textAlign: "center"
  },

  button: {
    padding: "10px 18px",
    background: "linear-gradient(to right, #0072ff, #00c6ff)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    marginBottom: "15px"
  }
};



// 🟢 Home Component
function Home({ setResult, result }) {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Customer Churn Dashboard</h1>

      <div style={styles.card}>
        <CustomerForm setResult={setResult} />
      </div>

      <div style={styles.card}>
        <ResultCard result={result} />
      </div>
    </div>
  );
}



// 🟢 Customers Page
function Customers() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Customer List</h1>

      <button style={styles.button} onClick={() => navigate("/")}>
        Back to Dashboard
      </button>

      <div style={styles.card}>
        <CustomerTable />
      </div>
    </div>
  );
}



// 🟢 Main App
function Main() {
  const [result, setResult] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Home setResult={setResult} result={result} />} />
      <Route path="/customers" element={<Customers />} />
    </Routes>
  );
}

export default Main;