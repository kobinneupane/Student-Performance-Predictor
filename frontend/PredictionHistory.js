import React, { useEffect, useState } from "react";
import axios from "axios";

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);

  const fetchPredictions = async () => {
    try {
      const token = localStorage.getItem("token"); // 🔑 get JWT token
      if (!token) {
        alert("Unauthorized! Please login first.");
        return;
      }

      const res = await axios.get("http://127.0.0.1:5000/api/predictions", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach token
        },
      });

      setPredictions(res.data);
    } catch (err) {
      console.error("❌ Error fetching predictions:", err);
      alert("Failed to fetch predictions. Maybe your session expired.");
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📜 Prediction History</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Grade</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Details</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {predictions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No records found.
              </td>
            </tr>
          ) : (
            predictions.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2 font-medium">
                  {item.name || item.readableFeatures?.Name || "N/A"}
                </td>
                <td className="border px-4 py-2">{item.grade}</td>
                <td
                  className={`border px-4 py-2 font-bold ${
                    item.status === "Pass" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.status}
                </td>
                <td className="border px-4 py-2 text-left">
                  {item.readableFeatures &&
                    Object.entries(item.readableFeatures).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {value}
                      </div>
                    ))}
                </td>
                <td className="border px-4 py-2">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PredictionHistory;
