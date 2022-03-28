import userReducer from 'reducers/userReducer';
import settingsReducer from 'reducers/settingsReducer';
import notificationsReducer from 'reducers/notificationsReducer';
import messagesReducer from 'reducers/messagesReducer';
import footerReducer from 'reducers/footerReducer';
import searchReducer from 'reducers/searchReducer';
import groupReducer from 'reducers/groupReducer';
import postReducer from 'reducers/postReducer';
import complaintReducer from 'reducers/complaintReducer';
import globalChatReducer from 'reducers/globalChatReducer';
import personalReducer from 'reducers/personalReducer';

const rootReducer = {
  user: userReducer,
  settings: settingsReducer,
  notifications: notificationsReducer,
  messages: messagesReducer,
  footer: footerReducer,
  search: searchReducer,
  group: groupReducer,
  post: postReducer,
  complaint: complaintReducer,
  globalChat: globalChatReducer,
  personal: personalReducer,
};

export default rootReducer;
