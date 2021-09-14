const createError = require("http-errors");
const AWS = require("aws-sdk");

const Pin = require("../models/Pin");
const User = require("../models/User");
const ERROR = require("../constants/error");

const AWS_REGION = process.env.AWS_REGION;
const IDENTITY_POOL_ID = process.env.IDENTITY_POOL_ID;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

exports.getMyPin = async function (req, res, next) {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email }).lean();
    const { _id } = user;
    const myCreatedPins = await Pin.find({ creator: _id }).lean();
    const mySavedPins = await Pin.find({ savedUser: _id }).lean();

    if (!user) {
      return next(createError(400, ERROR.notFoundUser));
    }

    return res.json({ status: "OK", myCreatedPins, mySavedPins });
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
exports.createPin = async function (req, res, next) {
  console.log("!!!!!!!!!!!!!!!!!!");
  const { tags, text, creator, coords } = req.body;
  console.log("",req.files);
  const { buffer, originalname } = req.files.photo[0];
  console.log("!!!!!!!!!!!!!!!!!!");
  const parsedTags = JSON.parse(tags);
  const parsedCoords = JSON.parse(coords);
  const date = Date.now().toString();

  AWS.config.update({
    region: AWS_REGION,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IDENTITY_POOL_ID,
    }),
  });

  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `pins/${date}_${originalname}`,
    ACL: "public-read",
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/jpg",
  };

  const s3 = new AWS.S3();

  try {
    s3.upload(params, async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        await Pin.create({
          image: data.Location,
          creator,
          text,
          tag: parsedTags,
          position: {
            type: "Point",
            coordinates: parsedCoords,
          },
        });

        res.json({ status: "Save Pin" });
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePin = async function (req, res, next) {
  const { pinId } = req.body;

  try {
    const currentTime = new Date().toISOString();

    await Pin.findByIdAndUpdate(
      pinId,
      {
        savedAt: currentTime,
      },
      {
        active: false,
      },
    );

    return res.json({ status: "OK" });
  } catch (err) {
    next(err);
  }
};

exports.delete = async function (req, res, next) {
  const { id } = req.body;

  try {
    await Pin.deleteMany({ creator: id });

    res.json({ status: "OK" });
  } catch (err) {
    next(err);
  }
};
