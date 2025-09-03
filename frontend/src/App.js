import React, { useState } from "react";
import axios from "axios";
import PredictionHistory from "./components/PredictionHistory";
import Login from "./components/Login"; // Teacher Login
import "./App.css";

function App() {
  const [page, setPage] = useState("predict");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Authentication state
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  const [formData, setFormData] = useState({
    Name: "",
    Gender: "",
    Faculty: "",
    Semester: "",
    Attendance: "",
    Assignment: "",
    InternalMarks: "",
    PreviousMarks: "",
    ProjectScore: "",
    StudyHours: "",
    ParentalEducation: "",
    ParentalSupport: "",
    InternetAccess: "",
    ExtraCurricular: "",
    Engagement: "",
    Improvement: "",
  });

  const [result, setResult] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const featuresArray = [
        Number(formData.Gender),
        Number(formData.Faculty),
        Number(formData.Semester),
        Number(formData.Attendance),
        Number(formData.Assignment),
        Number(formData.InternalMarks),
        Number(formData.PreviousMarks),
        Number(formData.ProjectScore),
        Number(formData.StudyHours),
        Number(formData.ParentalEducation),
        Number(formData.ParentalSupport),
        Number(formData.InternetAccess),
        Number(formData.ExtraCurricular),
        Number(formData.Engagement),
        Number(formData.Improvement),
      ];

      // 🔑 Use lowercase "name" for backend consistency
      const studentData = { ...formData, name: formData.Name };

      const response = await axios.post("http://127.0.0.1:5000/api/predict", {
        features: featuresArray,
        studentData,
      });

      setResult(response.data);
    } catch (error) {
      console.error("❌ Error in prediction:", error);
      alert("Prediction failed! Check console.");
    }
  };

  // If not logged in → show Login page
  if (!auth) {
    return <Login onLoginSuccess={() => setAuth(true)} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "220px" : "70px",
          background: "#000000ff",
          color: "white",
          padding: "15px 10px",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s ease",
        }}
      >
        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "22px",
            marginBottom: "20px",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          ☰
        </button>

        {sidebarOpen && (
          <h2 style={{ marginBottom: "30px", textAlign: "center" }}>
             Predictor
          </h2>
        )}

        <button
          onClick={() => setPage("predict")}
          style={page === "predict" ? sidebarActive : sidebarButton}
        >
           {sidebarOpen && "Predict"}
        </button>
        <button
          onClick={() => setPage("history")}
          style={page === "history" ? sidebarActive : sidebarButton}
        >
           {sidebarOpen && "History"}
        </button>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setAuth(false);
          }}
          style={{
            ...sidebarButton,
            marginTop: "auto",
            background: "#901824ff",
            color: "white",
          }}
        >
          🚪 {sidebarOpen && "Logout"}
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#c9d1deff",
          overflowY: "auto",
        }}
      >
        {page === "predict" ? (
          <div>
            <h1 style={{ marginBottom: "20px", color: "#333" }}>
              Student Performance Predictor
            </h1>

            {/* Form Card */}
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "25px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <form className="form-box" onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px 20px",
                  }}
                >
                  {renderInput("Student Name", "Name", "text", handleChange)}
                  {renderSelect("Gender", "Gender", [
                    { value: "0", label: "Male" },
                    { value: "1", label: "Female" },
                  ], handleChange)}
                  {renderSelect("Faculty", "Faculty", [
                    { value: "0", label: "Science" },
                    { value: "1", label: "Management" },
                    { value: "2", label: "Humanities" },
                  ], handleChange)}
                  {renderInput("Semester/Year", "Semester", "number", handleChange, { min: 1, max: 8 })}
                  {renderInput("Attendance (%)", "Attendance", "number", handleChange, { min: 0, max: 100 })}
                  {renderInput("Assignment (%)", "Assignment", "number", handleChange, { min: 0, max: 100 })}
                  {renderInput("Internal Marks (50)", "InternalMarks", "number", handleChange, { min: 0, max: 50 })}
                  {renderInput("Previous Marks (%)", "PreviousMarks", "number", handleChange, { min: 0, max: 100 })}
                  {renderInput("Project Score (%)", "ProjectScore", "number", handleChange, { min: 0, max: 100 })}
                  {renderInput("Study Hours/Week", "StudyHours", "number", handleChange, { min: 0, max: 80 })}
                  {renderSelect("Parental Education", "ParentalEducation", [
                    { value: "0", label: "None" },
                    { value: "1", label: "School" },
                    { value: "2", label: "College" },
                    { value: "3", label: "University" },
                  ], handleChange)}
                  {renderSelect("Parental Support", "ParentalSupport", [
                    { value: "0", label: "Low" },
                    { value: "1", label: "Medium" },
                    { value: "2", label: "High" },
                  ], handleChange)}
                  {renderSelect("Internet Access", "InternetAccess", [
                    { value: "0", label: "No" },
                    { value: "1", label: "Yes" },
                  ], handleChange)}
                  {renderSelect("Extra-curricular", "ExtraCurricular", [
                    { value: "0", label: "No" },
                    { value: "1", label: "Yes" },
                  ], handleChange)}
                  {renderInput("Engagement Score", "Engagement", "number", handleChange, { min: 0, max: 100 })}
                  {renderSelect("Improvement", "Improvement", [
                    { value: "0", label: "No" },
                    { value: "1", label: "Yes" },
                  ], handleChange)}
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "12px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Predict
                </button>
              </form>
            </div>

            {/* Prediction Result */}
            {result && (
              <div
                style={{
                  marginTop: "25px",
                  padding: "20px",
                  borderRadius: "10px",
                  background: result.status === "Pass" ? "#d4edda" : "#f8d7da",
                  color: result.status === "Pass" ? "#155724" : "#721c24",
                  border: `1px solid ${
                    result.status === "Pass" ? "#c3e6cb" : "#f5c6cb"
                  }`,
                  maxWidth: "900px",
                  margin: "25px auto",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <h2>Prediction Result</h2>
                <p>
                  <strong>Grade:</strong> {result.prediction}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ fontWeight: "bold" }}>{result.status}</span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <PredictionHistory />
        )}
      </div>
    </div>
  );
}

// Reusable Input
const renderInput = (label, name, type, handleChange, extraProps = {}) => (
  <div>
    <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>
      {label}
    </label>
    <input
      type={type}
      name={name}
      onChange={handleChange}
      {...extraProps}
      required
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
      }}
    />
  </div>
);

// Reusable Select
const renderSelect = (label, name, options, handleChange) => (
  <div>
    <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>
      {label}
    </label>
    <select
      name={name}
      onChange={handleChange}
      required
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
      }}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Sidebar button styles
const sidebarButton = {
  background: "transparent",
  border: "none",
  color: "white",
  padding: "12px",
  textAlign: "left",
  borderRadius: "6px",
  marginBottom: "10px",
  cursor: "pointer",
  fontSize: "16px",
};

const sidebarActive = {
  ...sidebarButton,
  background: "white",
  color: "#071422ff",
  fontWeight: "bold",
};

export default App;
