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
        type: "Point",
        coordinates: coords,
      },
    });

    return res.status(200).json({ message: "Save Pin" });
  } catch (err) {
    next(err);
  }
};

exports.findPins = async function (req, res, next) {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);

  try {
    const pinsList = await Pin.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          distanceField: "dist.calculated",
          maxDistance: 1000,
          spherical: true,
        },
      },
    ]);

    return res.json({ pinsList: pinsList });
  } catch (err) {
    next(err);
  }
};
