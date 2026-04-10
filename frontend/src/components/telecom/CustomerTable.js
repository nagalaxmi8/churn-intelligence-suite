import { useEffect, useState } from "react";
import { getCustomers, predictChurn } from "./services/api";

export default function CustomerTable() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const rowsPerPage = 10;

  // =========================
  // Fetch Data
  // =========================
  useEffect(() => {
    getCustomers()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  // =========================
  // Pagination
  // =========================
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // =========================
  // Predict Function (FIXED 🔥)
  // =========================
  const handlePredict = async (c) => {
    setLoading(true);

    try {
      const payload = {
        Age: Number(c.Age) || 0,

        Number_of_Dependents: Number(c["Number of Dependents"] ?? 0),
        Tenure_in_Months: Number(c["Tenure in Months"] ?? 0),
        Monthly_Charge: Number(c["Monthly Charge"] ?? 0),
        Total_Charges: Number(c["Total Charges"] ?? 0),

        Contract: c.Contract ?? "Month-to-month",
        Internet_Service: c["Internet Service"] ?? "Fiber optic",
        Internet_Type: c["Internet Type"] ?? "Cable",

        Online_Security: c["Online Security"] ?? "No",
        Premium_Tech_Support: c["Premium Tech Support"] ?? "No",

        Payment_Method: c["Payment Method"] ?? "Electronic check",
        Paperless_Billing: c["Paperless Billing"] ?? "Yes",

        City: c.City ?? "Los Angeles"
      };

      console.log("Payload:", payload); // DEBUG

      const res = await predictChurn(payload);
      setSelectedResult(res.data);

    } catch (err) {
      console.error("Prediction Error:", err.response?.data || err.message);
    }

    setLoading(false);
  };

  // =========================
  // Render
  // =========================
  return (
    <div className="table-container">
      <h2>All Customers</h2>

      <table>
        <thead>
          <tr>
            <th>Age</th>
            <th>City</th>
            <th>Gender</th>
            <th>Tenure</th>
            <th>Monthly</th>
            <th>Total</th>
            <th>Contract</th>
            <th>Internet</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((c, i) => (
            <tr key={i}>
              <td>{c.Age}</td>
              <td>{c.City}</td>
              <td>{c.Gender || "-"}</td>
              <td>{c["Tenure in Months"]}</td>
              <td>{c["Monthly Charge"]}</td>
              <td>{c["Total Charges"]}</td>
              <td>{c.Contract || "-"}</td>
              <td>{c["Internet Service"] || "-"}</td>
              <td>{c["Payment Method"] || "-"}</td>
              <td>{c["Customer Status"]}</td>

              <td>
                <button
                  className="predict-btn"
                  onClick={() => handlePredict(c)}
                  disabled={loading}
                >
                  {loading ? "..." : "Predict"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        <span>Page {currentPage} / {totalPages}</span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedResult && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Prediction Result</h3>

            <p>
              Churn:{" "}
              <strong>
                {selectedResult.churn === 1 ? "Yes ⚠️" : "No ✅"}
              </strong>
            </p>

           {selectedResult.strategies && (
  <div>
    <p><strong>Retention Strategies:</strong></p>
    <ul>
      {selectedResult.strategies.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ul>
  </div>
)}

            <button onClick={() => setSelectedResult(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}