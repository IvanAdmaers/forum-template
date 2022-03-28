import io from 'socket.io-client';

const socketURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/private-chats`;

let socket = null;

export const connectSocket = () => {
  socket = io(socketURL, { withCredentials: true, forceNew: true });
};

export const socketConneced = (callback) => {
  socket.on('connect', callback);
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const chatList = (callback) => {
  socket.on('chat:list', callback);
};

export const getChatList = () => {
  socket.emit('chat:list');
};

export const updateChatListTrigger = (callback) => {
  socket.on('chats:update', callback);
};

export const requestChat = (chatId = '') => {
  socket.emit('chat:request', chatId);
};

export const chatMessages = (callback) => {
  socket.on('chat:messages', callback);
};

export const newChatMessage = (callback) => {
  socket.on('message:new', callback);
};

export const markChatAsRead = (interlocutorId = '') => {
  socket.emit('chat:read', interlocutorId);
};

export const sendMessage = (
  interlocutorId = '',
  message = '',
  replyTo = null
) => {
  socket.emit('message:add', interlocutorId, message, replyTo);
};

export const leaveChat = () => {
  socket.emit('chat:leave');
};

export const error = (callback) => {
  socket.on('error', callback);
};
