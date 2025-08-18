const mongoose = require("mongoose");

const regulatorSchema = new mongoose.Schema(
  {
    attendance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
      required: true,
    },
    authDate: { type: Date, required: false },
    contractor: { type: String, required: true },
    recovered: { type: Boolean, required: false },
    estimatedArrivalDate: { type: Date, required: false },
    arrivalDate: { type: Date, required: false },
    finalDate: { type: Date, required: false },
    serviceProvider: { type: String, required: false },
    place: { type: String, required: false },
    km: { type: Number, required: false },
    standingTime: { type: Number, required: false },
    observation: { type: String, required: false },
    Attachments_filename: { type: [String], required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Regulator", regulatorSchema);
