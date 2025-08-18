const mongoose = require("mongoose");

const victimSchema = new mongoose.Schema(
  {
    attendance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
      required: true,
    },
    victim: { type: Boolean, required: false },
    fatal_victim: { type: Boolean, required: false },
    driver_victim: { type: Number, required: false },
    third_party_victim: { type: Number, required: false },
    fatal_driver_victim: { type: Number, required: false },
    fatal_third_party_victim: { type: Number, required: false },
    culpability: { type: Boolean, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Victim", victimSchema);
