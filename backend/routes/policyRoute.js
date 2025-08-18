const { Router } = require("express");

const {
  getPolicies,
  getPolicy,
  postPolicy,
  putPolicy,
  deletePolicy,
} = require("../controllers/policyController");

const router = Router({ mergeParams: true });

router.get("/", getPolicies);
router.get("/:id", getPolicy);
router.post("/", postPolicy);
router.put("/:id", putPolicy);
router.delete("/:id", deletePolicy);

module.exports = router;
