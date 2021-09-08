const express = require("express");
const router = express.Router();
const multer = require("multer");

const usersController = require("../controllers/usersController");

const upload = multer();

router.post(
  "/signup",
  upload.fields([{ name: "photo" }]),
  usersController.signup,
);

module.exports = router;
