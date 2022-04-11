import mongoose from "mongoose";
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
import { connectToDatabase } from "./dbConnect";

await connectToDatabase();

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    mobile: { type: Number, required: true, unique: true },
    agentId: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    level: { type: Number, default: 0 },
    services: { type: Array },
    active: { type: Boolean, default: true },
    suspended: { type: Boolean, default: false },
    otp: { type: Number, select: false },
    otpExpiresAt: Date,
    pin: { type: Number, select: false },
    verified: { type: Boolean, default: false },
    wallet: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    totalKg: { type: Number, default: 0 },
    customerMatchCount: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["agent", "customer", "sec", "mod", "admin"],
      default: "agent",
    },
    photo: String,
    bankName: { type: String },
    accountNumber: { type: String },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// set index on special fields
userSchema.index({
  mobile: 1,
  email: 1,
  active: 1,
});

// db functions and method
userSchema.pre("save", async function () {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return;

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.confirmPassword = undefined;
});

// run every time before a save action is performed
userSchema.pre("save", function () {
  if (!this.isModified("password") || this.isNew) return;

  this.passwordChangedAt = Date.now() - 1000;
});

// run before a find action is performed
userSchema.pre(/^find/, function () {
  // this points to the current query
  this.find({
    active: {
      $ne: false,
    },
  });
});

// verify user password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// set password changed Time
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

// create reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

mongoose.models = {};
const User = mongoose.model("User", userSchema);

module.exports = User;
