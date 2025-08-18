const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    insured: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insured",
      required: false,
    },
    company_name: { type: String, required: false },
    cnpj: { type: String, required: false },
    policy_name: { type: String, required: false },
    policy_file_metadata: { type: String, required: false }, // Store file path or URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Policy", policySchema);
