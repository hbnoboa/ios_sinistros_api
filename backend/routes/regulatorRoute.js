const { Router } = require("express");

const {
  getRegulators,
  getRegulator,
  postRegulator,
  putRegulator,
  deleteRegulator,
} = require("../controllers/regulatorController");

const router = Router({ mergeParams: true });

router.get("/", getRegulators);
router.get("/:id", getRegulator);
router.post("/", postRegulator);
router.put("/:id", putRegulator);
router.delete("/:id", deleteRegulator);

module.exports = router;
