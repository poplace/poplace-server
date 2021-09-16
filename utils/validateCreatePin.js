const ERROR = require("../constants/error");

function validateCreatePin({
  tags,
  text,
  creator,
  coords,
  buffer,
  originalname,
}) {
  const checkEng = /[a-zA-Z]/;

  if (!tags || !text || !creator || !coords || !buffer || !originalname) {
    return { isValid: false, message: ERROR.VALIDATION.invalidPinData };
  }

  if (tags.length > 3) {
    return { isValid: false, message: ERROR.VALIDATION.invalidtags };
  }

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];

    if (checkEng.test(tag)) {
      return { isValid: false, message: ERROR.VALIDATION.invalidtags };
    }

    if (tag.length > 5) {
      return { isValid: false, message: ERROR.VALIDATION.invalidtags };
    }
  }

  if (text.length < 10) {
    return { isValid: false, message: ERROR.VALIDATION.invalidTxt };
  }

  if (!buffer || !originalname) {
    return { isValid: false, message: ERROR.VALIDATION.invalidImage };
  }

  return { isValid: true };
}

module.exports = validateCreatePin;
