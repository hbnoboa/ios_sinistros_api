const interactionModel = require("../models/interactionModel");

// Get paginated attendance interactions for an attendance
module.exports.getInteractions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const attendanceId = req.params.attendanceId;

  try {
    const [interactions, total] = await Promise.all([
      interactionModel
        .find({ attendance: attendanceId })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      interactionModel.countDocuments({ attendance: attendanceId }),
    ]);

    res.json({
      interactions,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single attendance interaction by ID
module.exports.getInteraction = (req, res) => {
  interactionModel
    .findById(req.params.id)
    .then((data) => {
      res.status(200).json({
        status: "interaction found",
        data: { interaction: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "interaction not found",
        message: err,
      });
    });
};

module.exports.postInteraction = (req, res) => {
  interactionModel
    .create({ ...req.body, attendance: req.params.attendanceId })
    .then((data) => {
      req.app.get("io")?.emit("interactionCreated", data);
      res.status(200).json({
        status: "interaction created",
        data: { interaction: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "interaction not created",
        message: err,
      });
    });
};

// Update an attendance interaction by ID
module.exports.putInteraction = (req, res) => {
  interactionModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      req.app.get("io")?.emit("interactionUpdated", data);
      res.status(200).json({
        status: "interaction updated",
        data: { interaction: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "interaction not updated",
        message: err,
      });
    });
};

// Delete an attendance interaction by ID
module.exports.deleteInteraction = (req, res) => {
  interactionModel
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      req.app.get("io")?.emit("interactionDeleted", data);
      res.status(200).json({
        status: "interaction deleted",
        data: { interaction: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "interaction not deleted",
        message: err,
      });
    });
};
