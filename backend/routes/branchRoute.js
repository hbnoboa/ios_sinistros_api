const { Router } = require("express");

const {
  getBranches,
  getBranch,
  postBranch,
  putBranch,
  deleteBranch,
} = require("../controllers/branchController");

const router = Router({ mergeParams: true });

router.get("/", getBranches);
router.get("/:id", getBranch);
router.post("/", postBranch);
router.put("/:id", putBranch);
router.delete("/:id", deleteBranch);

module.exports = router;
