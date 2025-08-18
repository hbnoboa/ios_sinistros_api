const policyModel = require("../models/policyModel");

// Get all policies for an insured (paginated)
module.exports.getPolicies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const insuredId = req.params.insuredId;

  try {
    const [policies, total] = await Promise.all([
      policyModel
        .find({ insured: insuredId })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      policyModel.countDocuments({ insured: insuredId }),
    ]);

    res.json({
      policies,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single policy by ID
module.exports.getPolicy = (req, res) => {
  policyModel
    .findById(req.params.id)
    .then((data) => {
      res.status(200).json({
        status: "policy found",
        data: { policy: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "policy not found",
        message: err,
      });
    });
};

// Create a new policy for an insured
module.exports.postPolicy = (req, res) => {
  policyModel
    .create({ ...req.body, insured: req.params.insuredId })
    .then((data) => {
      req.app.get("io")?.emit("policyCreated", data);
      res.status(200).json({
        status: "policy created",
        data: { policy: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "policy not created",
        message: err,
      });
    });
};

// Update a policy by ID
module.exports.putPolicy = (req, res) => {
  policyModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      req.app.get("io")?.emit("policyUpdated", data);
      res.status(200).json({
        status: "policy updated",
        data: { policy: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "policy not updated",
        message: err,
      });
    });
};

// Delete a policy by ID
module.exports.deletePolicy = (req, res) => {
  policyModel
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      req.app.get("io")?.emit("policyDeleted", data);
      res.status(200).json({
        status: "policy deleted",
        data: { policy: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "policy not deleted",
        message: err,
      });
    });
};
