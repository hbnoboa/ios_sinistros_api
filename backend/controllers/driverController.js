const driverModel = require("../models/driverModel");

// Get all drivers for a shipping company (paginated)
module.exports.getDrivers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const shippingCompanyId = req.params.shippingCompanyId;

  try {
    const [drivers, total] = await Promise.all([
      driverModel
        .find({ shipping_company: shippingCompanyId })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      driverModel.countDocuments({ shipping_company: shippingCompanyId }),
    ]);

    res.json({
      drivers,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get a single driver by ID
module.exports.getDriver = (req, res) => {
  driverModel
    .findById(req.params.id)
    .then((data) => {
      res.status(200).json({
        status: "driver found",
        data: { driver: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "driver not found",
        message: err,
      });
    });
};

// Create a new driver for a shipping company
module.exports.postDriver = (req, res) => {
  driverModel
    .create({ ...req.body, shipping_company: req.params.shippingCompanyId })
    .then((data) => {
      req.app.get("io")?.emit("driverCreated", data);
      res.status(200).json({
        status: "driver created",
        data: { driver: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "driver not created",
        message: err,
      });
    });
};

// Update a driver by ID
module.exports.putDriver = (req, res) => {
  driverModel
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      req.app.get("io")?.emit("driverUpdated", data);
      res.status(200).json({
        status: "driver updated",
        data: { driver: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "driver not updated",
        message: err,
      });
    });
};

// Delete a driver by ID
module.exports.deleteDriver = (req, res) => {
  driverModel
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      req.app.get("io")?.emit("driverDeleted", data);
      res.status(200).json({
        status: "driver deleted",
        data: { driver: data },
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "driver not deleted",
        message: err,
      });
    });
};
