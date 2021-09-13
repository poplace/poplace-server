const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const pinsController = require("../controllers/pinsController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", pinsController.findPins);
router.get("/:pinId", pinsController.getMyPin);
router.post("/", verifyToken, upload.fields([{ name: "photo" }]), pinsController.createPin);
router.put("/:pinId", verifyToken, pinsController.updatePin);

module.exports = router;
