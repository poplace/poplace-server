const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const pinsController = require("../controllers/pinsController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, pinsController.findPins);
router.get("/:userId", verifyToken, pinsController.getMyPins);
router.post("/", verifyToken, upload.fields([{ name: "photo" }]), pinsController.createPin);
router.put("/:pinId", verifyToken, pinsController.updatePin);

module.exports = router;
