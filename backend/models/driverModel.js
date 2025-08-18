const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    shipping_company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingCompany",
      required: false,
    },
    name: { type: String, required: false },
    cpf: { type: String, required: false },
    contact: { type: String, required: false },
    plates: { type: [String], required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
