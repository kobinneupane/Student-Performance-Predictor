const express = require("express");
const Student = require("../models/Student");
const router = express.Router();

// Add a test student
router.post("/add", async (req, res) => {
  try {
    const student = new Student({
      name: "Test Student",
      gender: "Male",
      semester: "7th",
      attendance: 85,
      assignmentCompletion: 90,
      internalMarks: 40,
      finalResult: "Pass",
    });

    const savedStudent = await student.save();
    res.json(savedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
