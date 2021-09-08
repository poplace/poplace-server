const User = require("../models/User");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const SECRET_KEY = process.env.SECRET_KEY;

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
  try {
    if (req.files) {
      const buffer = req.files.photo[0].buffer;
      const fileName = req.files.photo[0].originalname;
      const date = Date.now().toString();

      AWS.config.update({
        region: process.env.AWS_REGION,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: process.env.IDENTITY_POOL_ID,
        }),
      });

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${date}_${fileName}`,
        ACL: "public-read",
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: "image/jpg",
      };

      const s3 = new AWS.S3();

      s3.upload(params, (error, data) => {
        if (error) {
          console.log(error);
        } else {
          return res.json({ status: "OK" });
        }
      });
    }
  } catch (err) {
    next(err);
  }
};
