const express = require("express");
const router = express.Router();

const pinsController = require("../controllers/pinsController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/:pinId",verifyToken, pinsController.getPin);
router.post("/", pinsController.createPin);

module.exports = router;
