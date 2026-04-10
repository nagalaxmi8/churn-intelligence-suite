import React from "react";

export default function StrategyPanel({ strategy }) {

  if (!strategy) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      
      <h3>Strategy</h3>

      <p><b>Source:</b> {strategy.source}</p>

      <p><b>Summary:</b> {strategy.strategy_summary}</p>

      <h4>Recommended Actions</h4>

      <p>If anything still looks off → paste result.strategy JSON, not screenshot.</p>
      <p>Offer age-specific benefits</p>
      <p>Provide premium financial benefits</p>

    </div>
  );
}