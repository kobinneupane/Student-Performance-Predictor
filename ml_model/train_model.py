# =========================
# train_model.py
# =========================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# 1. Load dataset
df = pd.read_csv("student_performance_dataset.csv")  # <-- make sure your dataset is here

# 2. Encode categorical columns
categorical_cols = [
    "Gender", "Faculty", "Parental Education",
    "Parental Support", "Internet Access", "Extra-curricular"
]

df_encoded = df.copy()
for col in categorical_cols:
    df_encoded[col] = LabelEncoder().fit_transform(df_encoded[col])

# 3. Define features and target
y = df_encoded["Final_Grade_Encoded"]
X = df_encoded.drop(columns=["Student_ID", "Final Grade", "Final_Grade_Encoded"])

print("✅ Features shape:", X.shape, "| Target shape:", y.shape)

# 4. Scale numeric features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 5. Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, stratify=y, random_state=42
)

# 6. Train Random Forest
model = RandomForestClassifier(
    n_estimators=200,
    class_weight="balanced",
    random_state=42
)
model.fit(X_train, y_train)

# 7. Evaluate
y_pred = model.predict(X_test)
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))

# 8. Save model + scaler
joblib.dump(model, "student_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("\n✅ Model and scaler saved successfully!")
