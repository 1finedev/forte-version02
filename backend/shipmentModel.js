const mongoose = require("mongoose");
const randomString = require("randomstring");
// import { connectToDatabase } from "./dbConnect";

// connectToDatabase();

const shipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "shipment can not be empty!"],
  },
  destination: {
    type: String,
    required: [true, "Destination can not be empty!"],
  },
  weight: {
    type: Number,
    required: [true, "Weight can not be empty!"],
  },
  extraWeight: {
    type: Number,
    default: 0,
  },
  carton: {
    type: String,
    required: [true, "Shipment must have a carton number!"],
  },
  mobile: {
    type: String,
    default: "",
  },
  shipCode: {
    type: String,
    default: `EU-${randomString.generate({
      capitalization: "uppercase",
      length: 6,
      charset: "alphabetic",
      readable: true,
    })}`,
  },
  shipStatus: {
    type: String,
    default: "✈️ IN TRANSIT",
    enum: [
      "✈️ IN TRANSIT",
      "WAREHOUSE",
      "DELIVERED",
      "RETURNED",
      "DAMAGED",
      "LOST",
    ],
  },
  action: {
    type: String,
    default: "🚚",
    enum: ["🚚", "🚫"],
  },
  shipType: {
    type: String,
    default: "Mix & Merge",
    enum: ["Mix & Merge", "Single", "Mix"],
  },
  paymentStatus: {
    type: String,
    default: "Unpaid",
    enum: ["Unpaid", "Paid", "Part-Payment"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dollarRate: {
    type: Number,
    default: "",
  },
  customsRate: {
    type: Number,
    default: "",
  },
  freightRate: {
    type: Number,
    default: "",
  },
  freightInDollars: {
    type: Number,
    default: "",
  },
  freightTotal: {
    type: Number,
    default: "",
  },
  customsTotal: {
    type: Number,
    default: "",
  },
  amountDue: {
    type: Number,
    default: "",
  },
  shipMode: {
    type: String,
    default: "✈️ Air Freight",
    enum: [
      "✈️ Air Freight",
      "🚢 Sea Freight",
      "🚂 Rail Freight",
      "🚚 Road Freight",
    ],
  },
  rebate: Number,
  dollarSide: Number,
  nairaSide: Number,
  discount: {
    type: Boolean,
    default: false,
    enum: [true, false],
  },
  discountAmount: { type: Number },
  locked: {
    type: Boolean,
    default: false,
    enum: [true, false],
  },
  messageSent: { type: Boolean, default: false, enum: [true, false] },
  calculated: { type: Boolean, default: false, enum: [true, false] },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "shipment must belong to an Agent"],
  },
});

shipmentSchema.index({
  carton: 1,
  name: 1,
  shipCode: 1,
  createdAt: 1,
  user: 1,
});

shipmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "agentId",
  });
  next();
});

mongoose.models = {};
const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;
