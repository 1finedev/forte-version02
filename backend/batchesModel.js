const mongoose = require("mongoose");

import { connectToDatabase } from "./dbConnect";
await connectToDatabase();

const batchSchema = new mongoose.Schema({
  batch: {
    type: Number,
    required: [true, "Batch is required"],
  },
  startDate: { type: Date, default: Date.now() },
});

const detailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Month is required"],
  },
  batches: [batchSchema],
});

const batchesSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: [true, "Year is required"],
      unique: true,
    },
    months: [detailsSchema],
  },
  { timestamps: true }
);

mongoose.models = {};
const Batch = mongoose.model("Batch", batchesSchema);

module.exports = Batch;
