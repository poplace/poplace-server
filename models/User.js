const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pushAlarmStatus: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model("User", userSchema);
