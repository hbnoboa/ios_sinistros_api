const shippingCompanyModel = require("../models/shippingCompanyModel");

// Get paginated shipping companies with optional filter
module.exports.getShippingCompanies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = req.query.filter
    ? { company_name: { $regex: req.query.filter, $options: "i" } }
    : {};

  try {
    const [shippingCompanies, total] = await Promise.all([
      shippingCompanyModel
        .find(filter)
        .sort({ company_name: 1 })
        .skip(skip)
        .limit(limit),
      shippingCompanyModel.countDocuments(filter),
    ]);

    res.json({
      shippingCompanies,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single shipping company by ID
module.exports.getShippingCompany = (req, res) => {
  shippingCompanyModel
    .findById(req.params.id)
    .then((data) => {
      res.status(200).json({
        status: "shipping company found",
        data: { shippingCompany: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "shipping company not found",
        message: err,
      });
    });
};

// Create a new shipping company
module.exports.postShippingCompany = (req, res) => {
  shippingCompanyModel
    .create(req.body)
    .then((data) => {
      req.app.get("io")?.emit("shippingCompanyCreated", data);
      res.status(200).json({
        status: "shipping company created",
        data: { shippingCompany: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "shipping company not created",
        message: err,
      });
    });
};

// Update a shipping company by ID
module.exports.putShippingCompany = (req, res) => {
  shippingCompanyModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      req.app.get("io")?.emit("shippingCompanyUpdated", data);
      res.status(200).json({
        status: "shipping company updated",
        data: { shippingCompany: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "shipping company not updated",
        message: err,
      });
    });
};

// Delete a shipping company by ID
module.exports.deleteShippingCompany = (req, res) => {
  shippingCompanyModel
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      req.app.get("io")?.emit("shippingCompanyDeleted", data);
      res.status(200).json({
        status: "shipping company deleted",
        data: { shippingCompany: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "shipping company not deleted",
        message: err,
      });
    });
};
