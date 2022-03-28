import {
  PERSONAL_SET_UNREAD_CHATS,
  PERSONAL_SET_CURRENT_CHAT_INTERLOCUTOR_ID,
} from 'constants/actionTypes';

export const setUnreadChats = (unreadChats = []) => ({
  type: PERSONAL_SET_UNREAD_CHATS,
  payload: unreadChats,
});

export const setCurrentChatInterlocutorId = (interlocutorId = '') => ({
  type: PERSONAL_SET_CURRENT_CHAT_INTERLOCUTOR_ID,
  payload: interlocutorId,
});
