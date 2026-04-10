import { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
// import './index.css';
export default function CustomerForm() {

  const [form, setForm] = useState({
    Age: "",
    Number_of_Dependents: "",
    Tenure_in_Months: "",
    Monthly_Charge: "",
    Total_Charges: "",
    City: "Los Angeles"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW: simulation state
  const [simulation, setSimulation] = useState(null);
  const [batchFile, setBatchFile] = useState(null);
const [batchResults, setBatchResults] = useState([]);
const [batchLoading, setBatchLoading] = useState(false);
const riskData = [
  { name: "HIGH", value: batchResults.filter(r => r.risk === "HIGH").length },
  { name: "MEDIUM", value: batchResults.filter(r => r.risk === "MEDIUM").length },
  { name: "LOW", value: batchResults.filter(r => r.risk === "LOW").length }
];
const [batchStrategies, setBatchStrategies] = useState("");
const [drivers, setDrivers] = useState([]);
  // =========================
  // Handle Input
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // Predict API
  // =========================
  const predict = async (data) => {
    setLoading(true);

    const payload = {
      Age: Number(data.Age),
      Number_of_Dependents: Number(data.Number_of_Dependents),
      Tenure_in_Months: Number(data.Tenure_in_Months),
      Monthly_Charge: Number(data.Monthly_Charge),
      Total_Charges: Number(data.Total_Charges),
      City: data.City
    };

    try {
      const res = await axios.post("http://localhost:8002/telecom_predict", payload);
      setResult(res.data);
      setSimulation(null); // reset old simulation
    } catch (err) {
      console.error("API Error:", err);
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    predict(form);
  };
const total = batchResults.length;
const churnCount = batchResults.filter(r => r.churn === 1).length;
const churnPercent = ((churnCount / total) * 100).toFixed(2);
  // =========================
  // APPLY STRATEGY (FIXED 🔥)
  // =========================
  const applyStrategy = async (strategy) => {

    try {
      const res = await axios.post("http://localhost:8002/telecom_apply_strategy", {
        customer: form,
        strategy: strategy,
        current_prob: result.probability,
        shap: result.shap   // 🔥 REQUIRED FIX
      });

      setSimulation({
        newProb: res.data.new_probability,
        improvement: res.data.improvement,
        strategy: strategy
      });

    } catch (err) {
      console.error(err);
    }
  };
  // =========================
// Batch File Change
// =========================
const handleBatchFileChange = (e) => {
  setBatchFile(e.target.files[0]);
};

// =========================
// Batch Upload API
// =========================
const handleBatchUpload = async () => {
  if (!batchFile) {
    alert("Please upload CSV file");
    return;
  }

  const formData = new FormData();
  formData.append("file", batchFile);

  setBatchLoading(true);

  try {
    const res = await axios.post(
      "http://127.0.0.1:8002/telecom_batch_predict",
      formData
    );

    console.log("API RESPONSE:", res.data); // 🔥 DEBUG

    // ✅ FIX: everything inside try
    setBatchResults(res.data.predictions);
    setDrivers(res.data.drivers || []);

    const strategyRes = await axios.post(
      "http://127.0.0.1:8002/telecom_batch_strategy",
      { customers: res.data.predictions }
    );

    setBatchStrategies(strategyRes.data.strategies);

  } catch (err) {
    console.error(err);
    alert("Batch upload failed");
  }

  setBatchLoading(false);
};


  return (
    <div >

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} >

        <h2>Customer Prediction</h2>

        <input name="Age" placeholder="Age" onChange={handleChange} />
        <input name="Number_of_Dependents" placeholder="Dependents" onChange={handleChange} />
        <input name="Tenure_in_Months" placeholder="Tenure" onChange={handleChange} />
        <input name="Monthly_Charge" placeholder="Monthly Charge" onChange={handleChange} />
        <input name="Total_Charges" placeholder="Total Charges" onChange={handleChange} />

        <input
          name="City"
          placeholder="City (e.g., Los Angeles)"
          onChange={handleChange}
        />

        <button type="submit">
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>
      {/* ================= BATCH PREDICTION ================= */}
<div className="card">

  <h2>📂 Batch Prediction</h2>

  <input
    type="file"
    accept=".csv"
    onChange={handleBatchFileChange}
  />

  <button onClick={handleBatchUpload}>
    {batchLoading ? "Processing..." : "Upload & Predict"}
  </button>

</div>
      {/* ================= RESULT ================= */}
      {result && (
        <div className="card">

          <h2>Prediction Result</h2>

          <h3>
            Churn Probability:
            <span className="highlight">
              {(result.probability * 100).toFixed(2)}%
            </span>
          </h3>

          <h3>
            Risk Level:
            <span className={`risk ${result.risk}`}>
              {result.risk}
            </span>
          </h3>

          {/* ===== SHAP GRAPH ===== */}
          <h3>Top Factors (SHAP)</h3>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={result.shap}>
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="shap" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===== STRATEGIES ===== */}
          <h3>Retention Strategies</h3>

          {result.strategies?.length === 0 && (
            <p style={{ color: "red" }}>No strategies available</p>
          )}

          {result.strategies?.map((s, i) => (
            <div key={i} className="strategy-card">

              <h4>{s.strategy}</h4>

              {/* 🔥 DESCRIPTION */}
              {s.description && (
                <p className="desc">{s.description}</p>
              )}

              <button onClick={() => applyStrategy(s)}>
                Apply Strategy
              </button>

            </div>
          ))}

          {/* ===== SIMULATION RESULT ===== */}
          {simulation && (
            <div className="simulation-card">

              <h3>Strategy Impact 🚀</h3>

              <p>
                <strong>Before:</strong> {(result.probability * 100).toFixed(2)}%
              </p>

              <p>
                <strong>After:</strong> {(simulation.newProb * 100).toFixed(2)}%
              </p>

              <p className="improvement">
                Improvement ↓ {(simulation.improvement * 100).toFixed(2)}%
              </p>

            </div>
          )}

        </div>
      )}
      {/* ================= BATCH RESULTS ================= */}
{batchResults.length > 0 && (<div>
  <div className="card ">
  <h2>📈 Dataset Summary</h2>

  <p>Total Customers: {total}</p>
  <p>Predicted Churn: {churnCount}</p>
  <p>Churn Percentage: {churnPercent}%</p>
</div>
{batchStrategies && (
  <div className="card">
    <h2>🧠 Combined Retention Strategy</h2>

    <pre style={{ whiteSpace: "pre-wrap" }}>
      {batchStrategies}
    </pre>
  </div>
)}
<div className="card ">
  <h3>Risk Distribution</h3>

  <PieChart width={300} height={300}>
    <Pie data={riskData} dataKey="value" outerRadius={100}>
      <Cell fill="red" />
      <Cell fill="orange" />
      <Cell fill="green" />
    </Pie>
    <Legend />
  </PieChart>
  {drivers.length > 0 && (
  <div className="card ">
    <h2>🔥 Top Churn Drivers (Batch)</h2>

    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={drivers}>
          <XAxis dataKey="feature" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="importance" fill="#ff4d4f" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)}
</div>
  <div className="card ">

    <h2>Batch Results</h2>

    {batchResults.map((item, i) => (
  <div key={i} className="strategy-card">

    <p><strong>City:</strong> {item.City}</p>

    <p>
      <strong>Churn:</strong>
      <span style={{ color: item.churn ? "red" : "green", marginLeft: 10 }}>
        {item.churn ? "Yes" : "No"}
      </span>
    </p>

    <p>
      <strong>Probability:</strong> {(item.probability * 100).toFixed(2)}%
    </p>

    <p>
      <strong>Risk:</strong>
      <span className={`risk ${item.risk}`}>
        {item.risk}
      </span>
    </p>

  </div>
))}

  </div>
  </div>
)}

      {/* ================= CSS ================= */}
      <style>{`
        .container {
          max-width: 900px;
          margin: auto;
          padding: 20px;
          font-family: Arial;
        }

        .card {
          padding: 20px;
          margin-top: 20px;
          border-radius: 10px;
        }

        input {
          display: block;
          margin: 10px 0;
          padding: 10px;
          width: 100%;
          border-radius: 5px;
          border: none;
        }

        button {
          padding: 10px;
          margin-top: 10px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          background: #4CAF50;
          color: white;
        }

        .strategy-card {
          padding: 10px;
          margin-top: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        .desc {
          font-size: 13px;
          color: gray;
        }

        .simulation-card {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          background: #f5f5f5;
        }

        .improvement {
          color: green;
          font-weight: bold;
        }

        .highlight {
          margin-left: 10px;
          color: #00aa88;
        }

        .risk {
          margin-left: 10px;
          padding: 5px 10px;
          border-radius: 5px;
        }

        .HIGH { background: red; color: white; }
        .MEDIUM { background: orange; color: white; }
        .LOW { background: green; color: white; }
      `}</style>

    </div>
  );
}