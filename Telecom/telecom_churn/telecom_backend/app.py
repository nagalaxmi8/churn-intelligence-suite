# # ==========================================
# # 1️⃣ Imports
# # ==========================================
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import pandas as pd
# import pickle
# import os
# import json
# from fastapi import UploadFile, File
# import io
# from groq import Groq
# from dotenv import load_dotenv
# import shap

# # ==========================================
# # 2️⃣ Init App
# # ==========================================
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],   # 🔥 fix frontend issues
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def home():
#     return {"message": "Customer Churn API Running 🚀"}

# # ==========================================
# # 3️⃣ Load ENV + LLM
# # ==========================================
# load_dotenv()
# client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# # ==========================================
# # 4️⃣ Load Model + Columns
# # ==========================================
# model = pickle.load(open("artifacts/xgb_churn_model.pkl", "rb"))
# model_columns = pickle.load(open("artifacts/model_columns.pkl", "rb"))

# explainer = shap.Explainer(model)

# # ==========================================
# # 5️⃣ Load Dataset
# # ==========================================
# df = pd.read_csv("datasets/train_data.csv")

# # ==========================================
# # 6️⃣ Request Schema
# # ==========================================
# class Customer(BaseModel):
#     Age: int
#     Number_of_Dependents: int
#     Tenure_in_Months: int
#     Monthly_Charge: float
#     Total_Charges: float
#     City: str

# def get_strategy_from_llm(customer_data, shap_data, prob):

#     features_text = ""
#     for f in shap_data:
#         direction = "increase" if f['shap'] > 0 else "decrease"
#         features_text += f"{f['feature']}={f['value']} ({direction}, impact={f['shap']:.3f})\n"

#     prompt = f"""
# You are a telecom churn expert.

# Churn probability: {round(prob*100,2)}%

# Customer:
# {customer_data}

# Top factors:
# {features_text}

# Return ONLY JSON:
# [
#   {{
#     "strategy": "...",
#     "feature": "...",
#     "action": "increase/decrease",
#     "change": number,
#     "description": "2-3 lines explanation"
#   }}
# ]
# """

#     response = client.chat.completions.create(
#         model="llama-3.3-70b-versatile",
#         messages=[{"role": "user", "content": prompt}],
#         temperature=0.5
#     )

#     try:
#         return json.loads(response.choices[0].message.content)
#     except:
#         print("LLM ERROR:", response.choices[0].message.content)
#         return []
# @app.post("/telecom_apply_strategy")
# def apply_strategy(data: dict):

#     base = data["customer"]
#     strategy = data["strategy"]

#     updated = base.copy()

#     # 🔥 FEATURE MAP (frontend → model)
#     feature_map = {
#         "Number of Dependents": "Number_of_Dependents",
#         "Tenure in Months": "Tenure_in_Months",
#         "Monthly Charge": "Monthly_Charge",
#         "Total Charges": "Total_Charges",
#         "Age": "Age",
#         "City": "City"
#     }

#     raw_feature = strategy.get("feature")
#     feature = feature_map.get(raw_feature, raw_feature)

#     action = strategy.get("action", "decrease")   # increase / decrease
#     change = float(strategy.get("change", 10))

#     print(f"Applying Strategy → Feature: {feature}, Action: {action}, Change: {change}")

#     # =========================
#     # APPLY STRATEGY CORRECTLY
#     # =========================
#     if feature in updated:

#         try:
#             current_value = float(updated[feature])

#             if action == "increase":
#                 new_value = current_value + change

#             elif action == "decrease":
#                 new_value = current_value - change

#             else:
#                 new_value = current_value  # fallback

#             # 🔥 Clamp values (avoid negative or unrealistic values)
#             if feature in ["Age", "Tenure_in_Months", "Monthly_Charge", "Total_Charges"]:
#                 new_value = max(0, new_value)

#             updated[feature] = new_value

#         except:
#             # 🔥 For categorical features like City
#             updated[feature] = strategy.get("value", updated[feature])

#     else:
#         print("⚠️ Feature not found:", feature)

#     # =========================
#     # ENCODE + PREDICT
#     # =========================
#     encoded = encode_input(updated)

#     new_prob = model.predict_proba(encoded)[0][1]

#     # =========================
#     # CALCULATE IMPROVEMENT
#     # =========================
#     old_prob = float(data.get("current_prob", 0))

#     improvement = old_prob - new_prob   # positive = good

#     print(f"Old Prob: {old_prob}, New Prob: {new_prob}, Improvement: {improvement}")

#     return {
#         "new_probability": float(new_prob),
#         "improvement": float(improvement),
#         "updated_customer": updated
#     }
# def encode_input(data_dict):
#     df = pd.DataFrame([data_dict])
#     df = pd.get_dummies(df)

#     for col in model_columns:
#         if col not in df:
#             df[col] = 0

#     return df[model_columns]

# # ==========================================
# # 9️⃣ Get Customers
# # ==========================================
# @app.get("/telecom_customers")
# def get_customers():
#     return df.to_dict(orient="records")

# # ==========================================
# # 🔟 Predict
# # ==========================================
# @app.post("/telecom_predict")
# def predict(customer: Customer):

#     try:
#         data = {
#             "Age": customer.Age,
#             "Number of Dependents": customer.Number_of_Dependents,
#             "Tenure in Months": customer.Tenure_in_Months,
#             "Monthly Charge": customer.Monthly_Charge,
#             "Total Charges": customer.Total_Charges,
#             "City": customer.City
#         }

#         encoded = encode_input(data)

#         # -------- Prediction --------
#         prob = model.predict_proba(encoded)[0][1]
#         pred = int(prob > 0.4)

#         # -------- SHAP --------
#         shap_values = explainer(encoded)
#         shap_vals = shap_values.values[0, :, 1]   # 🔥 churn class

#         # -------- Group SHAP --------
#         grouped = {}
#         for name, val in zip(model_columns, shap_vals):
#             base = "City" if name.startswith("City_") else name
#             grouped[base] = grouped.get(base, 0) + val

#         shap_list = [
#             {"feature": k, "value": str(data.get(k, "")), "shap": float(v)}
#             for k, v in grouped.items()
#         ]

#         shap_list = sorted(shap_list, key=lambda x: abs(x["shap"]), reverse=True)[:5]

#         # -------- LLM --------
#         strategies = get_strategy_from_llm(data, shap_list, prob)

#         # -------- Risk --------
#         risk = "HIGH" if prob > 0.75 else "MEDIUM" if prob > 0.4 else "LOW"

#         return {
#             "churn": pred,
#             "probability": float(prob),
#             "risk": risk,
#             "shap": shap_list,
#             "strategies": strategies
#         }

#     except Exception as e:
#         return {"error": str(e)}

# # ==========================================
# # 1️⃣1️⃣ Add Customer (FIXED)
# # ==========================================
# @app.post("/add_customer")
# def add_customer(customer: Customer):
#     global df

#     try:
#         data = {
#             "Age": customer.Age,
#             "Number of Dependents": customer.Number_of_Dependents,
#             "Tenure in Months": customer.Tenure_in_Months,
#             "Monthly Charge": customer.Monthly_Charge,
#             "Total Charges": customer.Total_Charges,
#             "City": customer.City
#         }

#         encoded = encode_input(data)

#         prob = model.predict_proba(encoded)[0][1]
#         pred = int(prob > 0.4)

#         shap_values = explainer(encoded)
#         shap_vals = shap_values.values[0, :, 1]

#         shap_list = [
#             {"feature": col, "value": str(data.get(col, "")), "shap": float(val)}
#             for col, val in zip(model_columns, shap_vals)
#         ]

#         shap_list = sorted(shap_list, key=lambda x: abs(x["shap"]), reverse=True)[:5]

#         strategies = get_strategy_from_llm(data, shap_list, prob)

#         data["Prediction"] = pred
#         data["Probability"] = float(prob)
#         data["Strategy"] = str(strategies)

#         df = pd.concat([df, pd.DataFrame([data])], ignore_index=True)

#         return {
#             "message": "Customer added successfully",
#             "data": data
#         }

#     except Exception as e:
#         return {"error": str(e)}
# ==========================================
# 1️⃣2️⃣ Batch Prediction (CSV Upload)
# ==========================================
# ==========================================
# 1️⃣ Imports
# ==========================================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import os
import json
from fastapi import UploadFile, File
import io
from groq import Groq
from dotenv import load_dotenv
import shap

# ==========================================
# 2️⃣ Init App
# ==========================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 🔥 fix frontend issues
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Customer Churn API Running 🚀"}

# ==========================================
# 3️⃣ Load ENV + LLM
# ==========================================
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ==========================================
# 4️⃣ Load Model + Columns
# ==========================================
model = pickle.load(open("artifacts/xgb_churn_model.pkl", "rb"))
model_columns = pickle.load(open("artifacts/model_columns.pkl", "rb"))

explainer = shap.Explainer(model)

# ==========================================
# 5️⃣ Load Dataset
# ==========================================
df = pd.read_csv("datasets/train_data.csv")

# ==========================================
# 6️⃣ Request Schema
# ==========================================
class Customer(BaseModel):
    Age: int
    Number_of_Dependents: int
    Tenure_in_Months: int
    Monthly_Charge: float
    Total_Charges: float
    City: str

def get_strategy_from_llm(customer_data, shap_data, prob):

    features_text = ""
    for f in shap_data:
        direction = "increase" if f['shap'] > 0 else "decrease"
        features_text += f"{f['feature']}={f['value']} ({direction}, impact={f['shap']:.3f})\n"

    prompt = f"""
You are a telecom churn expert.

Churn probability: {round(prob*100,2)}%

Customer:
{customer_data}

Top factors:
{features_text}

Return ONLY JSON:
[
  {{
    "strategy": "...",
    "feature": "...",
    "action": "increase/decrease",
    "change": number,
    "description": "2-3 lines explanation"
  }}
]
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )

    try:
        return json.loads(response.choices[0].message.content)
    except:
        print("LLM ERROR:", response.choices[0].message.content)
        return []
@app.post("/telecom_apply_strategy")
def apply_strategy(data: dict):

    base = data["customer"]
    strategy = data["strategy"]

    updated = base.copy()

    # 🔥 FEATURE MAP (frontend → model)
    feature_map = {
        "Number of Dependents": "Number_of_Dependents",
        "Tenure in Months": "Tenure_in_Months",
        "Monthly Charge": "Monthly_Charge",
        "Total Charges": "Total_Charges",
        "Age": "Age",
        "City": "City"
    }

    raw_feature = strategy.get("feature")
    feature = feature_map.get(raw_feature, raw_feature)

    action = strategy.get("action", "decrease")   # increase / decrease
    change = float(strategy.get("change", 10))

    print(f"Applying Strategy → Feature: {feature}, Action: {action}, Change: {change}")

    # =========================
    # APPLY STRATEGY CORRECTLY
    # =========================
    if feature in updated:

        try:
            current_value = float(updated[feature])

            if action == "increase":
                new_value = current_value + change

            elif action == "decrease":
                new_value = current_value - change

            else:
                new_value = current_value  # fallback

            # 🔥 Clamp values (avoid negative or unrealistic values)
            if feature in ["Age", "Tenure_in_Months", "Monthly_Charge", "Total_Charges"]:
                new_value = max(0, new_value)

            updated[feature] = new_value

        except:
            # 🔥 For categorical features like City
            updated[feature] = strategy.get("value", updated[feature])

    else:
        print("⚠️ Feature not found:", feature)

    # =========================
    # ENCODE + PREDICT
    # =========================
    encoded = encode_input(updated)

    new_prob = model.predict_proba(encoded)[0][1]

    # =========================
    # CALCULATE IMPROVEMENT
    # =========================
    old_prob = float(data.get("current_prob", 0))

    improvement = old_prob - new_prob   # positive = good

    print(f"Old Prob: {old_prob}, New Prob: {new_prob}, Improvement: {improvement}")

    return {
        "new_probability": float(new_prob),
        "improvement": float(improvement),
        "updated_customer": updated
    }
def encode_input(data_dict):
    df = pd.DataFrame([data_dict])
    df = pd.get_dummies(df)

    for col in model_columns:
        if col not in df:
            df[col] = 0

    return df[model_columns]

# ==========================================
# 9️⃣ Get Customers
# ==========================================
@app.get("/telecom_customers")
def get_customers():
    return df.to_dict(orient="records")

# ==========================================
# 🔟 Predict
# ==========================================
@app.post("/telecom_predict")
def predict(customer: Customer):

    try:
        data = {
            "Age": customer.Age,
            "Number of Dependents": customer.Number_of_Dependents,
            "Tenure in Months": customer.Tenure_in_Months,
            "Monthly Charge": customer.Monthly_Charge,
            "Total Charges": customer.Total_Charges,
            "City": customer.City
        }

        encoded = encode_input(data)

        # -------- Prediction --------
        prob = model.predict_proba(encoded)[0][1]
        pred = int(prob > 0.4)

        # -------- SHAP --------
        shap_values = explainer(encoded)
        shap_vals = shap_values.values[0, :, 1]   # 🔥 churn class

        # -------- Group SHAP --------
        grouped = {}
        for name, val in zip(model_columns, shap_vals):
            base = "City" if name.startswith("City_") else name
            grouped[base] = grouped.get(base, 0) + val

        shap_list = [
            {"feature": k, "value": str(data.get(k, "")), "shap": float(v)}
            for k, v in grouped.items()
        ]

        shap_list = sorted(shap_list, key=lambda x: abs(x["shap"]), reverse=True)[:5]

        # -------- LLM --------
        strategies = get_strategy_from_llm(data, shap_list, prob)

        # -------- Risk --------
        risk = "HIGH" if prob > 0.75 else "MEDIUM" if prob > 0.4 else "LOW"

        return {
            "churn": pred,
            "probability": float(prob),
            "risk": risk,
            "shap": shap_list,
            "strategies": strategies
        }

    except Exception as e:
        return {"error": str(e)}

# ==========================================
# 1️⃣1️⃣ Add Customer (FIXED)
# ==========================================
@app.post("/add_customer")
def add_customer(customer: Customer):
    global df

    try:
        data = {
            "Age": customer.Age,
            "Number of Dependents": customer.Number_of_Dependents,
            "Tenure in Months": customer.Tenure_in_Months,
            "Monthly Charge": customer.Monthly_Charge,
            "Total Charges": customer.Total_Charges,
            "City": customer.City
        }

        encoded = encode_input(data)

        prob = model.predict_proba(encoded)[0][1]
        pred = int(prob > 0.4)

        shap_values = explainer(encoded)
        shap_vals = shap_values.values[0, :, 1]

        shap_list = [
            {"feature": col, "value": str(data.get(col, "")), "shap": float(val)}
            for col, val in zip(model_columns, shap_vals)
        ]

        shap_list = sorted(shap_list, key=lambda x: abs(x["shap"]), reverse=True)[:5]

        strategies = get_strategy_from_llm(data, shap_list, prob)

        data["Prediction"] = pred
        data["Probability"] = float(prob)
        data["Strategy"] = str(strategies)

        df = pd.concat([df, pd.DataFrame([data])], ignore_index=True)

        return {
            "message": "Customer added successfully",
            "data": data
        }

    except Exception as e:
        return {"error": str(e)}
# ==========================================
# 1️⃣2️⃣ Batch Prediction (CSV Upload)
# ==========================================
@app.post("/telecom_batch_predict")
async def batch_predict(file: UploadFile = File(...)):

    try:
        print("🔥 API HIT")

        contents = await file.read()
        print("✅ File received")

        # =========================
        # READ CSV
        # =========================
        batch_df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        print("✅ CSV loaded:", batch_df.shape)

        # 🔥 Handle missing values
        batch_df = batch_df.fillna(0)

        results = []
        all_shap = []   # 🔥 store shap for all rows

        # =========================
        # LOOP THROUGH ROWS
        # =========================
        for i, row in batch_df.iterrows():
            print(f"➡ Processing row {i}")

            try:
                data = {
                    "Age": float(row.get("Age", 0)),
                    "Number of Dependents": float(row.get("Number of Dependents", 0)),
                    "Tenure in Months": float(row.get("Tenure in Months", 0)),
                    "Monthly Charge": float(row.get("Monthly Charge", 0)),
                    "Total Charges": float(row.get("Total Charges", 0)),
                    "City": str(row.get("City", "Unknown"))
                }

                # =========================
                # ENCODE INPUT
                # =========================
                encoded = encode_input(data)
                encoded = encoded.fillna(0)

                # =========================
                # PREDICT
                # =========================
                prob = model.predict_proba(encoded)[0][1]

                if pd.isna(prob) or prob in [float("inf"), float("-inf")]:
                    prob = 0.0

                # =========================
                # SHAP VALUES
                # =========================
                shap_values = explainer(encoded)
                shap_vals = shap_values.values[0, :, 1]

                # 🔥 GROUP SHAP (merge City columns)
                grouped = {}
                for name, val in zip(model_columns, shap_vals):
                    base = "City" if name.startswith("City_") else name
                    grouped[base] = grouped.get(base, 0) + val

                all_shap.append(grouped)

                # =========================
                # RESULT APPEND
                # =========================
                results.append({
                    "Age": data["Age"],
                    "Dependents": data["Number of Dependents"],
                    "Tenure": data["Tenure in Months"],
                    "MonthlyCharge": data["Monthly Charge"],
                    "TotalCharges": data["Total Charges"],
                    "City": data["City"],
                    "churn": int(prob > 0.4),
                    "probability": float(prob),
                    "risk": "HIGH" if prob > 0.75 else "MEDIUM" if prob > 0.4 else "LOW"
                })

            except Exception as row_error:
                print(f"❌ Error in row {i}: {row_error}")

                results.append({
                    "Age": None,
                    "City": "Error Row",
                    "churn": 0,
                    "probability": 0.0,
                    "risk": "LOW",
                    "error": str(row_error)
                })

        print("✅ ROW PROCESSING DONE")

        # =========================
        # 🔥 AGGREGATE SHAP DRIVERS
        # =========================
        shap_df = pd.DataFrame(all_shap).fillna(0)

        if len(shap_df) > 0:
            mean_shap = shap_df.mean()

            top_drivers = (
                mean_shap.abs()
                .sort_values(ascending=False)
                .head(5)
            )

            driver_list = [
                {
                    "feature": f,
                    "importance": float(mean_shap[f])
                }
                for f in top_drivers.index
            ]
        else:
            driver_list = []

        print("🔥 Drivers calculated")

        # =========================
        # FINAL RESPONSE
        # =========================
        return {
            "total": len(results),
            "predictions": results,
            "drivers": driver_list   # 🔥 NEW OUTPUT
        }

    except Exception as e:
        print("❌ Batch Error:", str(e))
        return {"error": str(e)}

@app.post("/telecom_batch_strategy")
def batch_strategy(data: dict):

    customers = data.get("customers", [])

    if not customers:
        return {"strategies": []}

    # 🔥 Filter high risk customers
    high_risk = [c for c in customers if c["risk"] in ["HIGH", "MEDIUM"]]

    if not high_risk:
        return {"strategies": ["All customers are low risk. Maintain current service quality."]}

    # 🔥 Aggregate insights
    avg_tenure = sum(c["Tenure"] for c in high_risk) / len(high_risk)
    avg_monthly = sum(c["MonthlyCharge"] for c in high_risk) / len(high_risk)

    summary = f"""
Total Customers: {len(customers)}
High Risk Customers: {len(high_risk)}

Average Tenure (high risk): {avg_tenure}
Average Monthly Charge (high risk): {avg_monthly}

Sample Customers:
{high_risk[:3]}
"""

    prompt = f"""
You are a telecom retention expert.

Based on the following batch analysis:

{summary}

Give 3-5 actionable retention strategies for reducing churn.

Return only bullet points.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )

    return {
        "strategies": response.choices[0].message.content
    }