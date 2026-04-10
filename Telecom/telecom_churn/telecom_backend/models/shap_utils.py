import pickle
import pandas as pd
import numpy as np

with open("artifacts/shap_values.pkl", "rb") as f:
    shap_values = pickle.load(f)

def get_top_features(customer_index, X_test, class_index=0, top_n=3):

    shap_vals = shap_values.values[customer_index, :, class_index]

    df = pd.DataFrame({
        "feature": X_test.columns,
        "value": X_test.iloc[customer_index].values,
        "shap_value": shap_vals
    })

    df["importance"] = np.abs(df["shap_value"])

    df = df.sort_values("importance", ascending=False)

    return df.head(top_n)