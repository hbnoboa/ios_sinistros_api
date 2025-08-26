const Attachment = require("../models/attachmentModel");

// Get paginated attachments for an attendance
module.exports.getAttachments = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const attendanceId = req.params.attendanceId;

  try {
    const [attachments, total] = await Promise.all([
      Attachment.find({ attendance: attendanceId })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      Attachment.countDocuments({ attendance: attendanceId }),
    ]);

    res.json({
      attachments,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single attachment by ID
module.exports.getAttachment = (req, res) => {
  Attachment.findById(req.params.id)
    .then((data) => {
      res.status(200).json({
        status: "attachment found",
        data: { attachment: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "attachment not found",
        message: err,
      });
    });
};

// Create a new attachment for an attendance
module.exports.postAttachment = (req, res) => {
  Attachment.create({
    ...req.body,
    attendance: req.params.attendanceId,
    company: req.companyId,
  })
    .then((data) => {
      res.status(200).json({
        status: "attachment created",
        data: { attachment: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "attachment not created",
        message: err,
      });
    });
};

// Update an attachment by ID
module.exports.putAttachment = (req, res) => {
  Attachment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      res.status(200).json({
        status: "attachment updated",
        data: { attachment: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "attachment not updated",
        message: err,
      });
    });
};

// Delete an attachment by ID
module.exports.deleteAttachment = (req, res) => {
  Attachment.findByIdAndDelete(req.params.id)
    .then((data) => {
      res.status(200).json({
        status: "attachment deleted",
        data: { attachment: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "attachment not deleted",
        message: err,
      });
    });
};
