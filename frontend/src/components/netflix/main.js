import React, { useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [formData, setFormData] = useState({
    last_login_days: "",
    watch_hours: "",
    profiles: "",
    avg_watch_time: "",
    monthly_fee: ""
  });

  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [batchResult, setBatchResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };
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
    maxWidth: "700px",
    background: "rgba(0,0,0,0.5)",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)"
  },

  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "none"
  },

  button: {
    padding: "10px 15px",
    marginTop: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    background: "linear-gradient(to right, #00c6ff, #0072ff)",
    color: "white"
  }
};
  // ✅ SAFE API CALL
  const handlePredict = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Backend error — check if server is running");
    }
  };

  // ✅ SAFE BATCH
  const handleBatch = async () => {
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await axios.post(
        "http://127.0.0.1:5000/batch_predict",
        fd
      );

      setBatchResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Batch failed — check backend");
    }
  };
return (
  <div style={styles.page}>
    <h1>Netflix Churn Dashboard</h1>

    {/* SINGLE */}
    <div style={styles.card}>
      <h3>Single Prediction</h3>

      {Object.keys(formData).map((k) => (
        <input
          key={k}
          name={k}
          placeholder={k}
          onChange={handleChange}
          style={styles.input}
        />
      ))}

      <button onClick={handlePredict} style={styles.button}>
        Predict
      </button>

      {result && !result.error && (
        <div>
          <p><b>Probability:</b> {result?.probability?.toFixed(3)}</p>
          <p><b>Risk:</b> {result?.risk}</p>

          <ul>
            {result?.strategy?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <div style={{ width: "300px" }}>
            <Pie
              data={{
                labels: ["Before", "After"],
                datasets: [{
                  data: [
                    result?.probability || 0,
                    result?.improved_probability || 0
                  ],
                  backgroundColor: ["#ff4d4d", "#28a745"]
                }]
              }}
            />
          </div>
        </div>
      )}
    </div>

    {/* BATCH */}
    <div style={styles.card}>
      <h3>Batch Prediction</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleBatch} style={styles.button}>
        Run Batch
      </button>

      {batchResult?.summary && (
        <div>
          <p>Total: {batchResult.summary.total_users}</p>
          <p>High: {batchResult.summary.high_risk}</p>
          <p>Medium: {batchResult.summary.medium_risk}</p>
          <p>Low: {batchResult.summary.low_risk}</p>

          <div style={{ width: "300px" }}>
            <Pie
              data={{
                labels: ["High", "Medium", "Low"],
                datasets: [{
                  data: [
                    batchResult.summary.high_risk,
                    batchResult.summary.medium_risk,
                    batchResult.summary.low_risk
                  ],
                  backgroundColor: ["#ff4d4d", "#ffc107", "#28a745"]
                }]
              }}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default App;