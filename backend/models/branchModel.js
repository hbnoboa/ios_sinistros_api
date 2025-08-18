const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    insured: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insured",
      required: false,
    },
    company_name: { type: String, required: false },
    cnpj: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);
