const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const router = express.Router();

// Register a new teacher
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ username });
    if (existingTeacher) {
      return res.status(400).json({ error: "Teacher already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save teacher
    const newTeacher = new Teacher({ username, password: hashedPassword });
    await newTeacher.save();

    res.json({ message: "✅ Teacher registered successfully" });
  } catch (err) {
    console.error("❌ Error registering teacher:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login teacher
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const teacher = await Teacher.findOne({ username });
    if (!teacher) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create token
    // Inside login route
    const token = jwt.sign(
        { id: teacher._id, username: teacher.username, role: "teacher" }, // 👈 added role
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );


    res.json({ message: "✅ Login successful", token });
  } catch (err) {
    console.error("❌ Error logging in teacher:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
