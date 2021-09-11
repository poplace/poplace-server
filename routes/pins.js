const express = require("express");
const router = express.Router();
const multer = require("multer");

const pinsController = require("../controllers/pinsController");

const upload = multer();

router.get("/", pinsController.getMyPin);
router.post("/", upload.fields([{ name: "photo" }]), pinsController.createPin);

module.exports = router;
