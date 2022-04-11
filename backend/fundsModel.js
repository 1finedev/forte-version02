const mongoose = require("mongoose");
import { connectToDatabase } from "./dbConnect";
connectToDatabase();

const fundsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
    comment: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    adminComment: { type: String },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "request must belong to an Agent"],
    },
  },
  { timestamps: true }
);

fundsSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: ["agentId", "mobile", "fullname"],
  });
  next();
});
mongoose.models = {};
const Funds = mongoose.model("Funds", fundsSchema);

module.exports = Funds;
