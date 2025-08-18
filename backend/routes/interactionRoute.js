const { Router } = require("express");

const {
  getInteractions,
  getInteraction,
  postInteraction,
  putInteraction,
  deleteInteraction,
} = require("../controllers/interactionController");

const router = Router({ mergeParams: true });

router.get("/", getInteractions);
router.get("/:id", getInteraction);
router.post("/", postInteraction);
router.put("/:id", putInteraction);
router.delete("/:id", deleteInteraction);

module.exports = router;
