const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");   
require("dotenv").config();

const app = express(); // ✅ must come before app.use()

// Middleware
app.use(cors());                
app.use(express.json());

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Root test route
app.get("/", (req, res) => {
    res.send("Hello, MongoDB is connected!");
});

// Student routes
const studentRoutes = require("./routes/student.js");
app.use("/students", studentRoutes);

// Prediction routes
const predictionRoutes = require("./routes/prediction.js");
app.use("/api", predictionRoutes);   // ✅ prefix with /api

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
