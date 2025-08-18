const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer(); // armazena em memória

const { faceLogin, faceRegister } = require("../controllers/faceController");

router.post("/login", upload.single("file"), faceLogin);
router.post("/register", upload.single("file"), faceRegister);

module.exports = router;
