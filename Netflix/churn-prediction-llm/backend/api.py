from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import os
from gemini_engine import generate_strategy

app = Flask(__name__)
CORS(app)

# ================= LOAD MODEL + COLUMNS =================
try:
    BASE_DIR = os.path.dirname(__file__)

    model_path = os.path.join(BASE_DIR, "models", "churn_model.pkl")
    columns_path = os.path.join(BASE_DIR, "models", "columns.pkl")

    model = pickle.load(open(model_path, "rb"))
    columns = pickle.load(open(columns_path, "rb"))

    print("✅ Model & columns loaded successfully")

except Exception as e:
    raise Exception(f"❌ CRITICAL: Model loading failed → {e}")


# ================= SINGLE PREDICTION =================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Convert to DataFrame
        df = pd.DataFrame([data])

        # Add missing columns
        for col in columns:
            if col not in df:
                df[col] = 0

        # Keep correct order
        df = df[columns]

        # Predict
        prob = float(model.predict_proba(df)[0][1])

        # Clamp probability
        prob = max(0, min(prob, 1))

        # Risk classification
        if prob > 0.7:
            risk = "High"
        elif prob > 0.4:
            risk = "Medium"
        else:
            risk = "Low"

        # Strategy (LLM)
        strategy = generate_strategy(prob, risk)

        # Impact
        improved_prob = max(prob - 0.2, 0)
        impact = f"Churn reduced by {round((prob - improved_prob) * 100, 1)}%"

        return jsonify({
            "probability": prob,
            "risk": risk,
            "strategy": strategy,
            "improved_probability": improved_prob,
            "impact": impact
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= BATCH PREDICTION =================
@app.route("/batch_predict", methods=["POST"])
def batch_predict():
    try:
        file = request.files.get("file")

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        df = pd.read_csv(file)

        # Add missing columns
        for col in columns:
            if col not in df:
                df[col] = 0

        # Correct order
        df = df[columns]

        # Predict
        probs = model.predict_proba(df)[:, 1]
        probs = pd.Series(probs).clip(0, 1)

        df["prob"] = probs

        # Risk classification
        df["risk"] = df["prob"].apply(
            lambda x: "High" if x > 0.7 else "Medium" if x > 0.4 else "Low"
        )

        # Summary
        total = len(df)
        high = int((df["risk"] == "High").sum())
        medium = int((df["risk"] == "Medium").sum())
        low = int((df["risk"] == "Low").sum())
        avg_prob = float(df["prob"].mean())

        # Strategy
        overall_strategy = generate_strategy(avg_prob, "Mixed")

        improved_prob = max(avg_prob - 0.2, 0)
        impact = f"Churn reduced by {round((avg_prob - improved_prob) * 100, 1)}%"

        return jsonify({
            "summary": {
                "total_users": total,
                "high_risk": high,
                "medium_risk": medium,
                "low_risk": low,
                "average_probability": avg_prob,
                "overall_strategy": overall_strategy,
                "impact": impact
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= RUN SERVER =================
if __name__ == "__main__":
    app.run(debug=True, port=5000)