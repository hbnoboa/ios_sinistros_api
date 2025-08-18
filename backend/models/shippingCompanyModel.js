const mongoose = require("mongoose");

const shippingCompanySchema = new mongoose.Schema(
  {
    company_name: { type: String, required: false },
    cnpj_cpf: { type: String, required: false },
    rntrc: { type: String, required: false },
    drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShippingCompany", shippingCompanySchema);
