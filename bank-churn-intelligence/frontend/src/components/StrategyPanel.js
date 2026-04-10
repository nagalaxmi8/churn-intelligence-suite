export default function StrategyPanel({ strategy }) {

  const actions = strategy?.recommended_actions || [];

  return (
    <div className="card">
      <h3>Retention Strategy ({strategy?.source || "N/A"})</h3>

      <p>
        <strong>Summary:</strong>{" "}
        {strategy?.strategy_summary ?? strategy?.portfolio_summary ?? "N/A"}
      </p>

      <h4>Recommended Actions</h4>

       <p>If anything still looks off → paste result.strategy JSON, not screenshot.</p>
       <p>Offer age-specific benefits</p>
       <p>Provide premium financial benefits</p>
       

      <h4>Business Reasoning</h4>
      <p>{strategy?.business_reasoning ?? strategy?.business_impact ?? "N/A"}</p>
    </div>
  );
}