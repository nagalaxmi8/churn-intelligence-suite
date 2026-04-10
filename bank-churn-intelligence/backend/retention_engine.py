import pandas as pd


# ======================================================
# 1️⃣ Extract Top Positive SHAP Drivers
# ======================================================

def get_top_shap_reasons(shap_values, feature_names, top_n=3):

    df = pd.DataFrame({
        "Feature": feature_names,
        "SHAP_Value": shap_values
    })

    df = df[df["SHAP_Value"] > 0]
    df = df.sort_values(by="SHAP_Value", ascending=False)

    return df.head(top_n)


# ======================================================
# 2️⃣ Map Features to Retention Actions
# ======================================================
def map_rules_to_actions(top_features_df):

    actions = []

    # 🔴 SAFETY: if no features → return default action
    if top_features_df is None or top_features_df.empty:
        return [{
            "action": "Provide general retention offer",
            "reason": "No strong churn drivers identified",
            "priority": "Medium"
        }]

    for _, row in top_features_df.iterrows():
        feature = str(row["Feature"]).lower()

        if "age" in feature:
            actions.append({
                "action": "Offer age-specific benefits",
                "reason": "Customer age segment shows higher churn tendency",
                "priority": "Medium"
            })

        elif "products_number" in feature or "single_product" in feature:
            actions.append({
                "action": "Offer bundle discount or cross-sell products",
                "reason": "Customer has low product engagement",
                "priority": "High"
            })

        elif "balance" in feature:
            actions.append({
                "action": "Provide premium financial benefits",
                "reason": "High balance customers expect better services",
                "priority": "High"
            })

        elif "active_member" in feature:
            actions.append({
                "action": "Increase personalized engagement outreach",
                "reason": "Inactive customers are more likely to churn",
                "priority": "High"
            })

        elif "credit_score" in feature:
            actions.append({
                "action": "Provide financial advisory support",
                "reason": "Low credit score indicates financial stress",
                "priority": "Medium"
            })

        elif "country" in feature:
            actions.append({
                "action": "Investigate region-specific churn behavior",
                "reason": "Regional patterns influencing churn",
                "priority": "Medium"
            })

        else:
            actions.append({
                "action": f"Address churn driver: {feature}",
                "reason": f"{feature} is contributing to churn risk",
                "priority": "Low"
            })

    # 🔴 REMOVE duplicates safely
    unique_actions = {}
    for a in actions:
        if a["action"] not in unique_actions:
            unique_actions[a["action"]] = a

    actions = list(unique_actions.values())

    # 🔴 FINAL SAFETY: ensure at least 1 valid action
    if not actions:
        actions = [{
            "action": "Provide personalized retention offer",
            "reason": "General churn risk detected",
            "priority": "Medium"
        }]

    return actions