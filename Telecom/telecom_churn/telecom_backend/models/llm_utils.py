import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def build_prompt(customer_data, top_features):

    features_text = ""

    for _, row in top_features.iterrows():
        features_text += f"- {row['feature']} = {row['value']} (impact score: {row['shap_value']:.3f})\n"

    prompt = f"""
You are a telecom churn expert.

Customer attributes:
- Tenure: {customer_data.get("Tenure in Months")}
- Contract: {customer_data.get("Contract")}
- Monthly Charge: {customer_data.get("Monthly Charge")}

Risk factors:
{features_text}

Explain churn reasons and give retention strategy.
"""

    return prompt


def generate_strategy(prompt):

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "Telecom retention strategist"},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content