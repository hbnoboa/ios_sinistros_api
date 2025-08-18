const insuredModel = require("../models/insuredModel");

// Get paginated insureds with optional filter
module.exports.getInsureds = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = req.query.filter
    ? { fantasy_name: { $regex: req.query.filter, $options: "i" } }
    : {};

  try {
    const [insureds, total] = await Promise.all([
      insuredModel
        .find(filter)
        .sort({ fantasy_name: 1 })
        .skip(skip)
        .limit(limit),
      insuredModel.countDocuments(filter),
    ]);

    res.json({
      insureds,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single insured by ID
module.exports.getInsured = (req, res) => {
  insuredModel
    .findById(req.params.id)
    .then((data) => {
      res.status(200).json({
        status: "insured found",
        data: { insured: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "insured not found",
        message: err,
      });
    });
};

// Create a new insured
module.exports.postInsured = (req, res) => {
  insuredModel
    .create(req.body)
    .then((data) => {
      req.app.get("io")?.emit("insuredCreated", data);
      res.status(200).json({
        status: "insured created",
        data: { insured: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "insured not created",
        message: err,
      });
    });
};

// Update an insured by ID
module.exports.putInsured = (req, res) => {
  insuredModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      req.app.get("io")?.emit("insuredUpdated", data);
      res.status(200).json({
        status: "insured updated",
        data: { insured: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "insured not updated",
        message: err,
      });
    });
};

// Delete an insured by ID
module.exports.deleteInsured = (req, res) => {
  insuredModel
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      req.app.get("io")?.emit("insuredDeleted", data);
      res.status(200).json({
        status: "insured deleted",
        data: { insured: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "insured not deleted",
        message: err,
      });
    });
};
