const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const pinsController = require("../controllers/pinsController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", pinsController.getMyPin);
router.put("/:pinId", verifyToken, pinsController.updatePin);
router.post("/", verifyToken, upload.fields([{ name: "photo" }]), pinsController.createPin);

module.exports = router;
