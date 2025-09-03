import React, { useState } from "react";
import API from "../api";

function PredictionForm({ onPrediction }) {
  const [features, setFeatures] = useState(Array(15).fill(""));

  const handleChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/predict", { features: features.map(Number) });
      alert(`Predicted Grade: ${res.data.prediction}, Status: ${res.data.status}`);
      onPrediction();
    } catch (err) {
      console.error(err);
      alert("Prediction failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>📊 Enter Student Details</h2>

      {/* Gender */}
      <div style={styles.field}>
        <label style={styles.label}>Gender</label>
        <select value={features[0]} onChange={(e) => handleChange(0, e.target.value)} style={styles.input} required>
          <option value="">-- Select Gender --</option>
          <option value="0">Male</option>
          <option value="1">Female</option>
        </select>
      </div>

      {/* Faculty */}
      <div style={styles.field}>
        <label style={styles.label}>Faculty</label>
        <select value={features[1]} onChange={(e) => handleChange(1, e.target.value)} style={styles.input} required>
          <option value="">-- Select Faculty --</option>
          <option value="1">Science</option>
          <option value="2">Management</option>
          <option value="3">Humanities</option>
          <option value="4">Engineering</option>
        </select>
      </div>

      {/* Semester/Year */}
      <div style={styles.field}>
        <label style={styles.label}>Semester/Year</label>
        <input type="number" value={features[2]} onChange={(e) => handleChange(2, e.target.value)} style={styles.input} placeholder="1-8" required />
      </div>

      {/* Attendance */}
      <div style={styles.field}>
        <label style={styles.label}>Attendance (%)</label>
        <input type="number" value={features[3]} onChange={(e) => handleChange(3, e.target.value)} style={styles.input} placeholder="0-100" required />
      </div>

      {/* Assignment Completion */}
      <div style={styles.field}>
        <label style={styles.label}>Assignment Completion (%)</label>
        <input type="number" value={features[4]} onChange={(e) => handleChange(4, e.target.value)} style={styles.input} placeholder="0-100" required />
      </div>

      {/* Internal Marks */}
      <div style={styles.field}>
        <label style={styles.label}>Internal Marks (out of 50)</label>
        <input type="number" value={features[5]} onChange={(e) => handleChange(5, e.target.value)} style={styles.input} placeholder="0-50" required />
      </div>

      {/* Previous Term Marks */}
      <div style={styles.field}>
        <label style={styles.label}>Previous Term Marks (%)</label>
        <input type="number" value={features[6]} onChange={(e) => handleChange(6, e.target.value)} style={styles.input} placeholder="0-100" required />
      </div>

      {/* Project/Practical Score */}
      <div style={styles.field}>
        <label style={styles.label}>Project/Practical Score (%)</label>
        <input type="number" value={features[7]} onChange={(e) => handleChange(7, e.target.value)} style={styles.input} placeholder="0-100" required />
      </div>

      {/* Study Hours */}
      <div style={styles.field}>
        <label style={styles.label}>Study Hours per Week</label>
        <input type="number" value={features[8]} onChange={(e) => handleChange(8, e.target.value)} style={styles.input} placeholder="0-40" required />
      </div>

      {/* Parental Education */}
      <div style={styles.field}>
        <label style={styles.label}>Parental Education</label>
        <select value={features[9]} onChange={(e) => handleChange(9, e.target.value)} style={styles.input} required>
          <option value="">-- Select Education --</option>
          <option value="0">None</option>
          <option value="1">Primary</option>
          <option value="2">Secondary</option>
          <option value="3">Bachelor</option>
          <option value="4">Master+</option>
        </select>
      </div>

      {/* Parental Support */}
      <div style={styles.field}>
        <label style={styles.label}>Parental Support</label>
        <select value={features[10]} onChange={(e) => handleChange(10, e.target.value)} style={styles.input} required>
          <option value="">-- Select Support --</option>
          <option value="0">None</option>
          <option value="1">Low</option>
          <option value="2">High</option>
        </select>
      </div>

      {/* Internet Access */}
      <div style={styles.field}>
        <label style={styles.label}>Internet Access</label>
        <select value={features[11]} onChange={(e) => handleChange(11, e.target.value)} style={styles.input} required>
          <option value="">-- Select --</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      {/* Extra-curricular */}
      <div style={styles.field}>
        <label style={styles.label}>Extra-curricular</label>
        <select value={features[12]} onChange={(e) => handleChange(12, e.target.value)} style={styles.input} required>
          <option value="">-- Select --</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      {/* Engagement Score */}
      <div style={styles.field}>
        <label style={styles.label}>Engagement Score (0-100)</label>
        <input type="number" value={features[13]} onChange={(e) => handleChange(13, e.target.value)} style={styles.input} placeholder="0-100" required />
      </div>

      {/* Improvement */}
      <div style={styles.field}>
        <label style={styles.label}>Improvement</label>
        <select value={features[14]} onChange={(e) => handleChange(14, e.target.value)} style={styles.input} required>
          <option value="">-- Select --</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      <button type="submit" style={styles.button}>
        Predict
      </button>
    </form>
  );
}

const styles = {
  field: { margin: "10px 0" },
  label: { display: "block", fontWeight: "bold", marginBottom: "5px" },
  input: { padding: "8px", width: "300px" },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginTop: "15px",
  },
};

export default PredictionForm;
