const victimModel = require("../models/victimModel");

// Get paginated victims for an attendance
module.exports.getVictims = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const attendanceId = req.params.attendanceId;

  try {
    const [victims, total] = await Promise.all([
      victimModel
        .find({ attendance: attendanceId })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      victimModel.countDocuments({ attendance: attendanceId }),
    ]);

    res.json({
      victims,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single victim by ID
module.exports.getVictim = (req, res) => {
  victimModel
    .findById(req.params.id)
    .then((data) => {
      res.status(200).json({
        status: "victim found",
        data: { victim: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "victim not found",
        message: err,
      });
    });
};

// Create a new victim for an attendance
module.exports.postVictim = (req, res) => {
  victimModel
    .create({ ...req.body, attendance: req.params.attendanceId })
    .then((data) => {
      req.app.get("io")?.emit("victimCreated", data);
      res.status(200).json({
        status: "victim created",
        data: { victim: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "victim not created",
        message: err,
      });
    });
};

// Update a victim by ID
module.exports.putVictim = (req, res) => {
  victimModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      req.app.get("io")?.emit("victimUpdated", data);
      res.status(200).json({
        status: "victim updated",
        data: { victim: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "victim not updated",
        message: err,
      });
    });
};

// Delete a victim by ID
module.exports.deleteVictim = (req, res) => {
  victimModel
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      req.app.get("io")?.emit("victimDeleted", data);
      res.status(200).json({
        status: "victim deleted",
        data: { victim: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "victim not deleted",
        message: err,
      });
    });
};
