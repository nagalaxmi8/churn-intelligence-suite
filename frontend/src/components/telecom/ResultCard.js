export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="result">
      <h3>Prediction Result</h3>
      <p>
        Churn: <strong>{result.churn === 1 ? "Yes ⚠️" : "No ✅"}</strong>
      </p>
      <p>Strategy: {result.strategy}</p>
    </div>
  );
}