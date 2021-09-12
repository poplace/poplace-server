const express = require("express");
const router = express.Router();

const pinsController = require("../controllers/pinsController");

router.post("/", pinsController.createPin);
router.get("/", pinsController.findPins);

module.exports = router;
