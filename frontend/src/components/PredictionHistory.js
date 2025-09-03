import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css"; // keep your styles

// Mapping for numeric → readable
const featureLabels = {
  Gender: { 0: "Male", 1: "Female" },
  Faculty: { 0: "Science", 1: "Management", 2: "Humanities" },
  ParentalEducation: { 0: "None", 1: "School", 2: "College", 3: "University" },
  ParentalSupport: { 0: "Low", 1: "Medium", 2: "High" },
  InternetAccess: { 0: "No", 1: "Yes" },
  ExtraCurricular: { 0: "No", 1: "Yes" },
  Improvement: { 0: "No", 1: "Yes" },
};

function PredictionHistory() {
  const [predictions, setPredictions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  // Fetch from backend
  const fetchPredictions = async () => {
    try {
      let url = "http://localhost:5000/api/predictions";
      if (filter !== "All") url += `?status=${filter}`;

      const token = localStorage.getItem("token"); // 🔑 teacher JWT
      if (!token) {
        console.warn("⚠️ No token found in localStorage");
        return;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //  backend sends array directly, not { data: [...] }
      const rawData = Array.isArray(res.data) ? res.data : [];

      // Transform features → readable
      const transformed = rawData.map((item) => {
        if (item.readableFeatures) return item;
        const raw = item.features || [];
        return {
          ...item,
          readableFeatures: {
            Gender: featureLabels.Gender[raw[0]] || raw[0],
            Faculty: featureLabels.Faculty[raw[1]] || raw[1],
            Semester: raw[2],
            Attendance: raw[3],
            Assignment: raw[4],
            InternalMarks: raw[5],
            PreviousMarks: raw[6],
            ProjectScore: raw[7],
            StudyHours: raw[8],
            ParentalEducation:
              featureLabels.ParentalEducation[raw[9]] || raw[9],
            ParentalSupport: featureLabels.ParentalSupport[raw[10]] || raw[10],
            InternetAccess: featureLabels.InternetAccess[raw[11]] || raw[11],
            ExtraCurricular:
              featureLabels.ExtraCurricular[raw[12]] || raw[12],
            Engagement: raw[13],
            Improvement: featureLabels.Improvement[raw[14]] || raw[14],
            Name: item.name || "N/A",
          },
        };
      });

      setPredictions(transformed);
    } catch (err) {
      console.error("Error fetching history:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [filter]);

  // Filter + Search + Sort
  const filteredAndSorted = predictions
    .filter((item) =>
      (item.readableFeatures?.Name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date_desc")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "date_asc")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "grade_asc") return a.grade.localeCompare(b.grade);
      if (sortBy === "grade_desc") return b.grade.localeCompare(a.grade);
      return 0;
    });

  // Delete a record
  const deletePrediction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPredictions(predictions.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting record:", err.response?.data || err.message);
      alert("Failed to delete record.");
    }
  };

  return (
    <div className="app-container" style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#333" }}>
         Prediction History
      </h1>

      {/* Controls Toolbar */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          background: "#f8f9fa",
          padding: "12px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <label style={{ fontWeight: "bold", marginRight: "8px" }}>
            Status:
          </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: "bold", marginRight: "8px" }}>
            Search:
          </label>
          <input
            type="text"
            value={search}
            placeholder="Student name..."
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold", marginRight: "8px" }}>
            Sort:
          </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="grade_asc">Grade A → F</option>
            <option value="grade_desc">Grade F → A</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          padding: "15px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#010913ff", color: "white" }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Grade</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Details</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "15px" }}>
                  No records found.
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((item, index) => (
                <tr
                  key={item._id}
                  style={{
                    background: index % 2 === 0 ? "#fffefeff" : "white",
                  }}
                >
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>
                    {item.readableFeatures?.Name || "N/A"}
                  </td>
                  <td style={tdStyle}>{item.grade}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        color: "white",
                        background:
                          item.status === "Pass" ? "#28a745" : "#dc3545",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={tdStyle} className="text-left">
                    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                      {Object.entries(item.readableFeatures || {}).map(
                        ([key, value]) =>
                          key !== "Name" && (
                            <li key={key}>
                              <strong>{key}:</strong> {value}
                            </li>
                          )
                      )}
                    </ul>
                  </td>
                  <td style={tdStyle}>
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => deletePrediction(item._id)}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles
const thStyle = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #ddd",
  verticalAlign: "top",
};

export default PredictionHistory;
