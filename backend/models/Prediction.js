const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    features: {
      type: [Number],
      required: true,
    },
    readableFeatures: {
      type: Object, // store the mapped values (Gender: Male, Faculty: Science, etc.)
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    status: {
      type: String, // Pass/Fail
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "predictions" }
);

module.exports = mongoose.model("Prediction", predictionSchema);
