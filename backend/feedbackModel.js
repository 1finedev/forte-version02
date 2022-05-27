const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: Number, required: true },
    services: { type: [String], required: true },
    agents: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

mongoose.models = {};
const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
