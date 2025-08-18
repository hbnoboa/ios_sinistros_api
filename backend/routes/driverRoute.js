const { Router } = require("express");

const {
  getDrivers,
  getDriver,
  postDriver,
  putDriver,
  deleteDriver,
} = require("../controllers/driverController");

const router = Router({ mergeParams: true });

router.get("/", getDrivers);
router.get("/:id", getDriver);
router.post("/", postDriver);
router.put("/:id", putDriver);
router.delete("/:id", deleteDriver);

module.exports = router;
