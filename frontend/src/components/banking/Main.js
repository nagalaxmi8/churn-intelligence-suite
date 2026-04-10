import React, { useState } from "react";
import ModeToggle from "./ModeToggle";
import SinglePrediction from "./SinglePrediction";
import BatchPrediction from "./BatchPrediction";
import "./Style.css";

function App() {
  const [mode, setMode] = useState("single");

  return (
    <div className="container">
      <h1>Customer Churn Intelligence Dashboard</h1>

      <ModeToggle mode={mode} setMode={setMode} />

      {mode === "single" && <SinglePrediction />}
      {mode === "batch" && <BatchPrediction />}
    </div>
  );
}

export default App;