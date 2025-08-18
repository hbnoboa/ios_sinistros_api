const branchModel = require("../models/branchModel");

// Get all branches for a insured (paginated)
module.exports.getBranches = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const insuredId = req.params.insuredId;

  try {
    const [branches, total] = await Promise.all([
      branchModel
        .find({ insured: insuredId })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      branchModel.countDocuments({ insured: insuredId }),
    ]);

    res.json({
      branches,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single branch by ID
module.exports.getBranch = (req, res) => {
  branchModel
    .findById(req.params.id)
    .then((data) => {
      res.status(200).json({
        status: "branch found",
        data: { branch: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "branch not found",
        message: err,
      });
    });
};

// Create a new branch for a insured
module.exports.postBranch = (req, res) => {
  branchModel
    .create({ ...req.body, insured: req.params.insuredId })
    .then((data) => {
      req.app.get("io")?.emit("branchCreated", data);
      res.status(200).json({
        status: "branch created",
        data: { branch: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "branch not created",
        message: err,
      });
    });
};

// Update a branch by ID
module.exports.putBranch = (req, res) => {
  branchModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      req.app.get("io")?.emit("branchUpdated", data);
      res.status(200).json({
        status: "branch updated",
        data: { branch: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "branch not updated",
        message: err,
      });
    });
};

// Delete a branch by ID
module.exports.deleteBranch = (req, res) => {
  branchModel
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      req.app.get("io")?.emit("branchDeleted", data);
      res.status(200).json({
        status: "branch deleted",
        data: { branch: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "branch not deleted",
        message: err,
      });
    });
};
