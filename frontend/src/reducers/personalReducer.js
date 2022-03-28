import { HYDRATE } from 'next-redux-wrapper';

import {
  PERSONAL_SET_UNREAD_CHATS,
  PERSONAL_SET_CURRENT_CHAT_INTERLOCUTOR_ID,
} from 'constants/actionTypes';

const initialState = {
  unreadChats: 0,
  currentChatInterlocutorId: '',
};

const personalReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.personal };

    case PERSONAL_SET_UNREAD_CHATS: {
      const unreadChats = action.payload.filter(
        (interlocutorId) => interlocutorId !== state.currentChatInterlocutorId
      );

      return { ...state, unreadChats };
    }

    case PERSONAL_SET_CURRENT_CHAT_INTERLOCUTOR_ID:
      return { ...state, currentChatInterlocutorId: action.payload };

    default:
      return state;
  }
};

export default personalReducer;
