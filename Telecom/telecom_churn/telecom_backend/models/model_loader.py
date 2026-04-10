import pickle

def load_model():

    with open("artifacts/xgb_churn_model.pkl", "rb") as f:
        model = pickle.load(f)

    return model