const mongoose = require("mongoose");

const geoSchema = new mongoose.Schema({
  location: {
    type: { type: String },
    coordinates: [],
  },
});

geoSchema.index({ location: "2dsphere" });

const pinsSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: [{
    type: String,
    required: true,
  }],
  text: {
    type: String,
    minLength: 10,
    required: true,
  },
  tag: [{
    type: String,
    required: true,
  }],
  viewedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  savedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  savedAt: {
    type: Date,
  },
  position: {
    type: geoSchema,
    required: true,
  },
}, {
  timestamps: { createdAt: true },
});

module.exports = mongoose.model("Pin", pinsSchema);
