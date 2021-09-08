const User = require("../models/User");
const AWS = require("aws-sdk");

exports.signup = async function (req, res, next) {
  try {
    console.log(req.body); // email, nickname
    console.log(req.files);
    // ?유효성검사
    // ?이미지 없으면 기본이미지

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

      // s3.upload(params, (error, data) => {
      //   if (error) {
      //     console.log("실패일세..");
      //     console.log(error);
      //     // 에러처리
      //   } else {
      //     console.log("성공일세..");
      //     console.log(data.Location);
      //     // 이미지링크 DB에 담기
      //   }
      // });
    }

    res.json("hi");
  } catch (err) {
    next(err);
  }
};
