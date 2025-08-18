const mongoose = require("mongoose");

const insuredSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: false },
    fantasy_name: { type: String, required: false },
    cnpj: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    address: { type: String, required: false },
    fantasy_name: { type: String, required: false },
    business_field: { type: String, required: false },

    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contact" }],
    policies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Policy" }],
    branches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Insured", insuredSchema);
