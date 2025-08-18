const attendanceModel = require("../models/attendanceModel");

// Get paginated attendances
module.exports.getAttendances = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [attendances, total] = await Promise.all([
      attendanceModel.find().sort({ _id: -1 }).skip(skip).limit(limit),
      attendanceModel.countDocuments(),
    ]);

    res.json({
      attendances,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single attendance by ID
module.exports.getAttendance = (req, res) => {
  const { id } = req.params;
  attendanceModel
    .findById(id)
    .then((data) => {
      res.status(200).json({
        status: "attendance found",
        data: { attendance: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "attendance not found",
        message: err,
      });
    });
};

// Create a new attendance
module.exports.postAttendance = (req, res) => {
  attendanceModel
    .create(req.body)
    .then((data) => {
      req.app.get("io")?.emit("attendanceCreated", data);
      res.status(200).json({
        status: "attendance created",
        data: { attendance: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "attendance not created",
        message: err,
      });
    });
};

// Update an attendance by ID
module.exports.putAttendance = (req, res) => {
  attendanceModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      req.app.get("io")?.emit("attendanceUpdated", data);
      res.status(200).json({
        status: "attendance updated",
        data: { attendance: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "attendance not updated",
        message: err,
      });
    });
};

// Delete an attendance by ID
module.exports.deleteAttendance = (req, res) => {
  attendanceModel
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      req.app.get("io")?.emit("attendanceDeleted", data);
      res.status(200).json({
        status: "attendance deleted",
        data: { attendance: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "attendance not deleted",
        message: err,
      });
    });
};
