export function bankingAdapter(data) {
  return {
    probability: data.churn_probability,
    risk: data.risk_level,
    drivers: data.top_drivers || [],
    retention: {
      before: data.churn_probability,
      after: data.retention_impact?.after ?? null
    },
    actions: data.rule_based_actions || []
  };
}

export function ecommerceAdapter(data) {
  return {
    probability: data.churn_probability,
    risk: data.churn_probability > 0.4 ? "High" :
          data.churn_probability > 0.2 ? "Medium" : "Low",
    drivers: data.top_reasons?.map(r => ({
      feature: r[0],
      impact: r[1]
    })) || [],
    retention: {
      before: data.churn_probability,
      after: data.new_probability_after_strategy
    },
    actions: data.recommended_actions || []
  };
}

export function telecomAdapter(data) {
  return {
    probability: data.probability,
    risk: data.risk,
    drivers: data.shap?.map(d => ({
      feature: d.feature,
      impact: d.shap
    })) || [],
    retention: {
      before: data.probability,
      after: null
    },
    actions: data.strategies?.map(s => s.strategy) || []
  };
}

export function netflixAdapter(data) {
  return {
    probability: data.probability,
    risk: data.risk,
    drivers: [],
    retention: {
      before: data.probability,
      after: data.improved_probability
    },
    actions: data.strategy || []
  };
}