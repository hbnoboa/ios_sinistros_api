const contactModel = require("../models/contactModel");

// Get all contacts for an insured (paginated)
module.exports.getContacts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const insuredId = req.params.insuredId;

  try {
    const [contacts, total] = await Promise.all([
      contactModel
        .find({ insured: insuredId })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      contactModel.countDocuments({ insured: insuredId }),
    ]);

    res.json({
      contacts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single contact by ID
module.exports.getContact = (req, res) => {
  contactModel
    .findById(req.params.id)
    .then((data) => {
      res.status(200).json({
        status: "contact found",
        data: { contact: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "contact not found",
        message: err,
      });
    });
};

// Create a new contact for an insured
module.exports.postContact = (req, res) => {
  contactModel
    .create({ ...req.body, insured: req.params.insuredId })
    .then((data) => {
      req.app.get("io")?.emit("contactCreated", data);
      res.status(200).json({
        status: "contact created",
        data: { contact: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "contact not created",
        message: err,
      });
    });
};

// Update a contact by ID
module.exports.putContact = (req, res) => {
  contactModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      req.app.get("io")?.emit("contactUpdated", data);
      res.status(200).json({
        status: "contact updated",
        data: { contact: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "contact not updated",
        message: err,
      });
    });
};

// Delete a contact by ID
module.exports.deleteContact = (req, res) => {
  contactModel
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      req.app.get("io")?.emit("contactDeleted", data);
      res.status(200).json({
        status: "contact deleted",
        data: { contact: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "contact not deleted",
        message: err,
      });
    });
};
