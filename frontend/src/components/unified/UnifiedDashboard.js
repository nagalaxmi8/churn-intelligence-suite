import React, { useState } from "react";
import modelConfig from "./modelConfig";
import DynamicForm from "./DynamicForm";

export default function UnifiedDashboard() {

  const [model, setModel] = useState("banking");
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);

  const config = modelConfig[model];

  const handlePredict = async () => {

    const res = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const raw = await res.json();

    const normalized = config.adapter(raw);

    setResult(normalized);
  };

  return (
    <div>

      <h1>Unified Churn Dashboard</h1>

      {/* MODEL SELECT */}
      <select onChange={(e) => setModel(e.target.value)}>
        <option value="banking">Banking</option>
        <option value="ecommerce">Ecommerce</option>
        <option value="telecom">Telecom</option>
        <option value="netflix">Netflix</option>
      </select>

      {/* FORM */}
      <DynamicForm fields={config.fields} setFormData={setFormData} />

      <button onClick={handlePredict}>Predict</button>

      {/* RESULT */}
      {result && (
        <div>
          <h2>Probability: {(result.probability * 100).toFixed(2)}%</h2>
          <h3>Risk: {result.risk}</h3>

          <h3>Actions</h3>
          <ul>
            {result.actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}