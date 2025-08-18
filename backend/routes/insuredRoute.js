const { Router } = require("express");

const {
  getInsureds,
  getInsured,
  postInsured,
  putInsured,
  deleteInsured,
} = require("../controllers/insuredController");

const router = Router();

router.get("/", getInsureds);
router.get("/:id", getInsured);
router.post("/", postInsured);
router.put("/:id", putInsured);
router.delete("/:id", deleteInsured);

module.exports = router;
