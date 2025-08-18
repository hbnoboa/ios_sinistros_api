const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    insured: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insured",
      required: false,
    },
    name: { type: String, required: false },
    role: { type: String, required: false },
    number: { type: String, required: false },
    email: { type: String, required: false },
    field: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
