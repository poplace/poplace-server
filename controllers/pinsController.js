const Pin = require("../models/Pin");

exports.createPin = async function (req, res, next) {
  const { tags, text, imageUri, creator, coords } = req.body;

  try {
    await Pin.create({
      image: imageUri,
      creator,
      text,
      tag: tags,
      position: {
        location: {
          type: "Point",
          coordinates: coords,
        },
      },
    });

    return res.status(200).json({ message: "Save Pin" });
  } catch (err) {
    next(err);
  }
};

exports.updatePin = async function (req, res, next) {
  const { pinId } = req.body;

  try {
    const currentTime = new Date().toISOString();

    await Pin.findByIdAndUpdate(pinId, {
      savedAt: currentTime,
    }, {
      active: false,
    });

    return res.json({ status: "OK" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
