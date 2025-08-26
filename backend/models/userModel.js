const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    confirmationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordSentAt: { type: Date },
    name: { type: String },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Operator", "User"],
      default: "User",
    },
    companies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
    faceDescriptor: { type: [Number], required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
