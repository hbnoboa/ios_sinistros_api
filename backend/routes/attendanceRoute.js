const { Router } = require("express");

const {
  getAttendances,
  getAttendance,
  postAttendance,
  putAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const router = Router();

router.get("/", getAttendances);
router.get("/:id", getAttendance);
router.post("/", postAttendance);
router.put("/:id", putAttendance);
router.delete("/:id", deleteAttendance);

module.exports = router;
