const { Router } = require("express");

const {
  getContacts,
  getContact,
  postContact,
  putContact,
  deleteContact,
} = require("../controllers/contactController");

const router = Router({ mergeParams: true });

router.get("/", getContacts);
router.get("/:id", getContact);
router.post("/", postContact);
router.put("/:id", putContact);
router.delete("/:id", deleteContact);

module.exports = router;
