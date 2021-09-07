const jwt = require("jsonwebtoken");

const User = require("../models/User");
const secretKey = process.env.SECRET_KEY;

exports.login = async function (req, res, next) {
  const { email } = req.body;

  try {
    const token = jwt.sign({ email }, secretKey);
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
