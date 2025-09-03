const axios = require("axios");
const Student = require("../models/Student");

exports.predictStudent = async (req, res) => {
  try {
    const { name, gender, semester, attendance, assignmentCompletion, internalMarks } = req.body;

    // Features for ML model (order must match training!)
    const features = [attendance, assignmentCompletion, internalMarks];

    // Call ML API (Flask running on port 5001)
    const response = await axios.post("http://127.0.0.1:5001/predict", {
      features,
    });

    const prediction = response.data.prediction;

    // Save student + prediction to DB
    const student = new Student({
      name,
      gender,
      semester,
      attendance,
      assignmentCompletion,
      internalMarks,
      finalResult: prediction,
    });

    const savedStudent = await student.save();

    res.json({ success: true, prediction, student: savedStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
