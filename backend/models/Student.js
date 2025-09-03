const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    semester: { type: String, required: true },
    attendance: { type: Number, required: true },
    assignmentCompletion: { type: Number, required: true },
    internalMarks: { type: Number, required: true },
    finalResult: { type: String }, // Pass/Fail from ML later
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
