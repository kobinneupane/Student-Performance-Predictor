from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load model and scaler
model = joblib.load("student_model.pkl")
scaler = joblib.load("scaler.pkl")

# Mapping A–F grades
grade_mapping = {
    0: "F",
    1: "D",
    2: "C",
    3: "B",
    4: "A"
}

# Pass/Fail mapping
def grade_to_pass_fail(grade):
    if grade in ["A", "B", "C"]:
        return "Pass"
    else:
        return "Fail"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        features = np.array(data["features"]).reshape(1, -1)

        # Scale features
        features_scaled = scaler.transform(features)

        # Predict
        prediction = model.predict(features_scaled)[0]
        grade = grade_mapping.get(int(prediction), "Unknown")

        # Convert to Pass/Fail
        result = grade_to_pass_fail(grade)

        return jsonify({
            "prediction": grade,   # keep original grade
            "status": result       # add pass/fail
        })
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
