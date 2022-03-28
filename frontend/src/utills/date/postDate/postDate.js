import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);

const postDate = (utcTime = 0) => dayjs(utcTime).locale('en').fromNow();

export default postDate;
