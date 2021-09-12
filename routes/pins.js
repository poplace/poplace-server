const express = require("express");
const router = express.Router();

const pinsController = require("../controllers/pinsController");

const verifyToken = require("../middlewares/verifyToken");

router.put("/:pinId", verifyToken, pinsController.updatePin);
router.post("/", verifyToken, pinsController.createPin);

module.exports = router;
