const Pin = require("../models/Pin");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const YOUR_SECRET_KEY = process.env.SECRET_KEY;

exports.getPin = async function (req, res, next) {
  const pinId = req.params.pinId;
  const routeName = req.query;
  const email = req.userEmail;

  try {
    const { _id: userId } = await User.findOne({ email });
    const pin = await Pin.findById(pinId).lean();
    const { image, tag, createdAt, savedAt, text, viewedUsers, creator } = pin;

    // 3번이상 조회한경우는 상세페이지 들어오기전에 처리하는지 확인하기

    const isCreator = creator === userId;
    const isViewedUser = viewedUsers.includes(userId);

    if (routeName === "main" && isCreator) {
      return res.json({ image, tag, createdAt, text });
    }

    if (routeName === "main" && !isViewedUser) {
      return res.json({ image, tag, createdAt, savedAt, text });
    }

    if (routeName === "main" && isViewedUser) {
      return res.json({ tag, createdAt, text });
    }

    if (routeName === "mypage" && isCreator) {
      return res.json({ image, tag, createdAt, text, savedAt });
    }

    if (routeName === "mypage") {
      return res.json({ image, tag, savedAt, text });
    }

    return res.json({ image, tag, createdAt, savedAt, text });
  } catch (err) {
    next(err);
  }
};

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
