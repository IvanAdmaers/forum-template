import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'

dayjs.extend(relativeTime);

/**
 * This function returns amount of days user is registered
 *
 * @param {string} date - User registration date
 * @returns {string} Date
 */
const userJoinedTime = (date) => {
  return dayjs().locale('en').from(dayjs(date), true);
};

export default userJoinedTime;
