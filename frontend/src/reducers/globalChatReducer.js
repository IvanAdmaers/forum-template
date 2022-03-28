import { HYDRATE } from 'next-redux-wrapper';

import {
  GLOBAL_CHAT_SET_MESSAGE,
  GLOBAL_CHAT_SET_REPLY_TO_MESSAGE_ID,
  GLOBAL_CHAT_CANCEL_REPLY_TO,
  GLOBAL_CHAT_SET_MESSAGES_LIST,
  GLOBAL_CHAT_ADD_MESSAGE,
  GLOBAL_CHAT_NEW_MESSAGE_WAS_SENT,
} from 'constants/actionTypes';

const initialState = {
  isLoading: true,
  messagesList: [],
  message: '',
  replyTo: null,
};

const globalChatReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case HYDRATE:
      return { ...state, ...payload.globalChat };

    case GLOBAL_CHAT_SET_MESSAGE:
      return { ...state, message: payload };

    case GLOBAL_CHAT_SET_REPLY_TO_MESSAGE_ID:
      return { ...state, replyTo: payload };

    case GLOBAL_CHAT_CANCEL_REPLY_TO:
      return { ...state, replyTo: null };

    case GLOBAL_CHAT_SET_MESSAGES_LIST:
      return { ...state, isLoading: false, messagesList: payload };

    case GLOBAL_CHAT_ADD_MESSAGE:
      return {
        ...state,
        messagesList: [...state.messagesList, payload],
      };

    case GLOBAL_CHAT_NEW_MESSAGE_WAS_SENT:
      return {
        ...state,
        message: initialState.message,
        replyTo: initialState.replyTo,
      };

    default:
      return state;
  }
};

export default globalChatReducer;
