const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

function getDate(time) {
  const targetTime = dayjs(time);
  const currentTime = dayjs(new Date());

  const difference = currentTime.diff(targetTime, "second");

  if (difference >= 86400) {
    return true;
  }

  return false;
}

module.exports = getDate;
