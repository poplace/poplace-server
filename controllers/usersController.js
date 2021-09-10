const jwt = require("jsonwebtoken");

const User = require("../models/User");
const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async function (req, res, next) {
  const { email } = req.body;

  try {
    const token = jwt.sign({ email }, SECRET_KEY);
    const originalMember = await User.findOne({ email }).lean();

    if (originalMember) {
      const { _id: id, nickname, image, pushAlarmStatus } = originalMember;

      return res.json({
        id,
        token,
        nickname,
        image,
        pushAlarmStatus,
        isOriginalMember: true,
      });
    }

    const user = await User.create({ email });
    const { _id: id } = user;

    return res.json({
      id,
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
