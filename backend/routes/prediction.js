const express = require("express");
const axios = require("axios");
const Prediction = require("../models/Prediction");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Feature label mappings
const featureLabels = {
  Gender: { 0: "Male", 1: "Female" },
  Faculty: { 0: "Science", 1: "Management", 2: "Humanities" },
  ParentalEducation: { 0: "None", 1: "School", 2: "College", 3: "University" },
  ParentalSupport: { 0: "Low", 1: "Medium", 2: "High" },
  InternetAccess: { 0: "No", 1: "Yes" },
  ExtraCurricular: { 0: "No", 1: "Yes" },
  Improvement: { 0: "No", 1: "Yes" },
};

// Convert numeric features into readable values
function mapReadableFeatures(data) {
  if (!data) return {};
  return {
    Name: data.Name || data.name || "Unknown",  // ✅ accepts both cases
    Gender: featureLabels.Gender[data.Gender] || data.Gender,
    Faculty: featureLabels.Faculty[data.Faculty] || data.Faculty,
    Semester: data.Semester,
    Attendance: data.Attendance,
    Assignment: data.Assignment,
    InternalMarks: data.InternalMarks,
    PreviousMarks: data.PreviousMarks,
    ProjectScore: data.ProjectScore,
    StudyHours: data.StudyHours,
    ParentalEducation:
      featureLabels.ParentalEducation[data.ParentalEducation] || data.ParentalEducation,
    ParentalSupport:
      featureLabels.ParentalSupport[data.ParentalSupport] || data.ParentalSupport,
    InternetAccess:
      featureLabels.InternetAccess[data.InternetAccess] || data.InternetAccess,
    ExtraCurricular:
      featureLabels.ExtraCurricular[data.ExtraCurricular] || data.ExtraCurricular,
    Engagement: data.Engagement,
    Improvement: featureLabels.Improvement[data.Improvement] || data.Improvement,
  };
}

/**
 * POST /predict
 * Calls Flask ML API, saves prediction into MongoDB
 */
router.post("/predict", async (req, res) => {
  try {
    const { features, studentData } = req.body;

    if (!features || !studentData) {
      return res.status(400).json({ error: "Missing features or student data" });
    }

    console.log("📥 Incoming features:", features);
    console.log("📥 Incoming studentData:", studentData);

    // Call Flask API
    const response = await axios.post("http://127.0.0.1:5001/predict", { features });
    const { prediction, status } = response.data;

    // Save into MongoDB
    const newPrediction = new Prediction({
      name: studentData.Name || studentData.name || "Unknown", // ✅ fix case mismatch
      features,
      readableFeatures: mapReadableFeatures(studentData),
      grade: prediction,
      status,
    });

    await newPrediction.save();
    console.log("✅ Saved to MongoDB:", newPrediction);

    res.json({
      message: "✅ Prediction successful and saved!",
      prediction,
      status,
    });
  } catch (error) {
    console.error("❌ Error in /predict:", error.message);
    res.status(500).json({ error: "Error connecting to ML service" });
  }
});

/**
 * GET /predictions
 * ✅ Protected route (teachers only)
 */
router.get("/predictions", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && (status === "Pass" || status === "Fail")) {
      query.status = status;
    }

    const predictions = await Prediction.find(query).sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    console.error("❌ Error fetching predictions:", err.message);
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
});

/**
 * DELETE /:id
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Prediction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json({ message: "✅ Record deleted" });
  } catch (err) {
    console.error("❌ Error deleting record:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /predictions
 */
router.delete("/predictions", authMiddleware, async (req, res) => {
  try {
    await Prediction.deleteMany({});
    res.json({ message: "🗑️ All records deleted" });
  } catch (err) {
    console.error("❌ Error deleting all records:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
