const User = require("../models/User");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const ERROR = require("../constants/error");

const SECRET_KEY = process.env.SECRET_KEY;
const AWS_REGION = process.env.AWS_REGION;
const IDENTITY_POOL_ID = process.env.IDENTITY_POOL_ID;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

exports.login = async function (req, res, next) {
  const { email } = req.body;

  try {
    const token = jwt.sign({ email }, SECRET_KEY);
    const originalMember = await User.findOne({ email }).lean();

    if (originalMember) {
      const { nickname, image, pushAlarmStatus } = originalMember;

      return res.json({
        token,
        nickname,
        image,
        pushAlarmStatus,
        isOriginalMember: true,
      });
    }

    await User.create({ email });

    return res.json({
      token,
      nickname: null,
      image: null,
      pushAlarmStatus: true,
      isOriginalMember: false,
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async function (req, res, next) {
  const { email, nickname } = req.body;
  const { buffer, originalname } = req.files.photo[0];
  const date = Date.now().toString();

  AWS.config.update({
    region: AWS_REGION,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IDENTITY_POOL_ID,
    }),
  });

  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `profiles/${date}_${originalname}`,
    ACL: "public-read",
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/jpg",
  };

  const s3 = new AWS.S3();

  try {
    const sameNickname = await User.findOne({ nickname }).lean();

    if (sameNickname) {
      return next(createError(400, ERROR.sameNickname));
    }

    await User.findOneAndUpdate({ email }, { nickname });

    s3.upload(params, async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        await User.findOneAndUpdate({ email }, { image: data.Location });

        res.json({ status: "OK" });
      }
    });
  } catch (err) {
    next(err);
  }
};
