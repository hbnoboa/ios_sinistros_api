const { Router } = require("express");

const {
  getVictims,
  getVictim,
  postVictim,
  putVictim,
  deleteVictim,
} = require("../controllers/victimController");

const router = Router({ mergeParams: true });

router.get("/", getVictims);
router.get("/:id", getVictim);
router.post("/", postVictim);
router.put("/:id", putVictim);
router.delete("/:id", deleteVictim);

module.exports = router;
