const regulatorModel = require("../models/regulatorModel");

// Get paginated regulators for an attendance
module.exports.getRegulators = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const attendanceId = req.params.attendanceId;

  try {
    const [regulators, total] = await Promise.all([
      regulatorModel
        .find({ attendance: attendanceId })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      regulatorModel.countDocuments({ attendance: attendanceId }),
    ]);

    res.json({
      regulators,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single regulator by ID
module.exports.getRegulator = (req, res) => {
  regulatorModel
    .findById(req.params.id)
    .then((data) => {
      res.status(200).json({
        status: "regulator found",
        data: { regulator: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "regulator not found",
        message: err,
      });
    });
};

// Create a new regulator for an attendance
module.exports.postRegulator = (req, res) => {
  regulatorModel
    .create({ ...req.body, attendance: req.params.attendanceId })
    .then((data) => {
      req.app.get("io")?.emit("regulatorCreated", data);
      res.status(200).json({
        status: "regulator created",
        data: { regulator: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "regulator not created",
        message: err,
      });
    });
};

// Update a regulator by ID
module.exports.putRegulator = (req, res) => {
  regulatorModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      req.app.get("io")?.emit("regulatorUpdated", data);
      res.status(200).json({
        status: "regulator updated",
        data: { regulator: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "regulator not updated",
        message: err,
      });
    });
};

// Delete a regulator by ID
module.exports.deleteRegulator = (req, res) => {
  regulatorModel
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      req.app.get("io")?.emit("regulatorDeleted", data);
      res.status(200).json({
        status: "regulator deleted",
        data: { regulator: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "regulator not deleted",
        message: err,
      });
    });
};
