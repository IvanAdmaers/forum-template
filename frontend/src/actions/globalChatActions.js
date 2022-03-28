import {
  GLOBAL_CHAT_SET_MESSAGE,
  GLOBAL_CHAT_SET_REPLY_TO_MESSAGE_ID,
  GLOBAL_CHAT_CANCEL_REPLY_TO,
  GLOBAL_CHAT_SET_MESSAGES_LIST,
  GLOBAL_CHAT_ADD_MESSAGE,
  GLOBAL_CHAT_NEW_MESSAGE_WAS_SENT,
} from 'constants/actionTypes';

export const setMessage = (message = '') => ({
  type: GLOBAL_CHAT_SET_MESSAGE,
  payload: message,
});

export const setReplyToMessage = (message = {}) => ({
  type: GLOBAL_CHAT_SET_REPLY_TO_MESSAGE_ID,
  payload: message,
});

export const cancelReplyToMessage = () => ({
  type: GLOBAL_CHAT_CANCEL_REPLY_TO,
});

export const setMessagesList = (messagesList = []) => ({
  type: GLOBAL_CHAT_SET_MESSAGES_LIST,
  payload: messagesList,
});

export const addMessage = (message = {}) => ({
  type: GLOBAL_CHAT_ADD_MESSAGE,
  payload: message,
});

export const messageWasSent = () => ({
  type: GLOBAL_CHAT_NEW_MESSAGE_WAS_SENT,
});
