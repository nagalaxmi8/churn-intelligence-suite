from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

# 🔹 Load everything ONCE (not inside function)
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

# IMPORTANT: must match training features EXACTLY
columns = joblib.load("columns.pkl")

# global counter
llm_calls = 0


# 🔹 Helper functions (you MUST have these)
def get_risk(prob):
    if prob > 0.7:
        return "High"
    elif prob > 0.4:
        return "Medium"
    else:
        return "Low"


def get_drivers(data):
    drivers = []
    if data.get("balance", 0) > 100000:
        drivers.append("High balance")
    if data.get("age", 0) > 50:
        drivers.append("Senior customer")
    return drivers


def generate_strategy(data, prob, risk):
    return [f"Take action for {risk} risk customer"]


# 🔹 MAIN ROUTE
@app.route("/batch_predict", methods=["POST"])
def batch_predict():
    global llm_calls

    try:
        file = request.files["file"]
        df = pd.read_csv(file)

        results = []

        high, medium, low = 0, 0, 0
        total_prob = 0
        all_drivers = []

        for _, row in df.iterrows():
            data = row.to_dict()

            # 🔹 Convert to dataframe
            input_df = pd.DataFrame([data])

            # 🔹 Align columns
            input_df = input_df.reindex(columns=columns, fill_value=0)

            # 🔹 Scale + predict
            scaled = scaler.transform(input_df)
            prob = model.predict_proba(scaled)[0][1]

            # 🔹 Risk + drivers
            risk = get_risk(prob)
            drivers = get_drivers(data)

            total_prob += prob
            all_drivers.extend(drivers)

            if risk == "High":
                high += 1
            elif risk == "Medium":
                medium += 1
            else:
                low += 1

            # 🔹 Limit LLM usage
            if prob > 0.5 and llm_calls < 5:
                strategy = generate_strategy(data, prob, risk)
                llm_calls += 1
            else:
                strategy = ["Low priority"]

            results.append({
                "probability": float(prob),
                "risk": risk,
                "drivers": drivers,
                "strategy": strategy
            })

        # 🔹 Summary
        summary = {
            "total_customers": len(df),
            "high_risk": high,
            "medium_risk": medium,
            "low_risk": low,
            "avg_probability": float(total_prob / len(df))
        }

        return jsonify({
            "summary": summary,
            "results": results
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔹 Run server
if __name__ == "__main__":
    app.run(debug=True)