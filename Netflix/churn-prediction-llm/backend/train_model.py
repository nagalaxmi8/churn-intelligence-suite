import pandas as pd
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# ================= LOAD DATA =================
file_path = os.path.join("..", "data", "netflix_customer_churn.csv")
df = pd.read_csv(file_path)

print("Columns:", df.columns)

# ================= PREPROCESS =================
target = "churned"

# Drop useless column
if "customer_id" in df.columns:
    df = df.drop(columns=["customer_id"])

# Features & target
X = df.drop(target, axis=1)
y = df[target]

# Convert categorical → numeric
X = pd.get_dummies(X)

# ✅ SAVE FINAL TRAINING COLUMNS (AFTER encoding)
columns = list(X.columns)

# ================= TRAIN TEST SPLIT =================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ================= MODEL =================
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# ================= EVALUATION =================
print("Accuracy:", model.score(X_test, y_test))

# ================= SAVE FILES =================
os.makedirs("models", exist_ok=True)

# ✅ Save model
with open("models/churn_model.pkl", "wb") as f:
    pickle.dump(model, f)

# ✅ Save columns (as LIST, not pandas Index)
with open("models/columns.pkl", "wb") as f:
    pickle.dump(columns, f)

print("✅ Model & columns saved successfully")