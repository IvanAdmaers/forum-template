import io from 'socket.io-client';

const socketURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/personal`;

let socket = null;

export const connectSocket = () => {
  socket = io(socketURL, { withCredentials: true, forceNew: true });
};

export const socketConneced = (callback) => {
  socket.on('connect', callback);
};

export const getUnreadChats = () => {
  socket.emit('chats:unread');
};

export const unreadChats = (callback) => {
  socket.on('chats:unread', callback);
};

export const unreadChatsUpdateTrigger = (callback) => {
  socket.on('chats:update', callback);
};
