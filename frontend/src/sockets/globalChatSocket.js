import io from 'socket.io-client';

const socketURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/global-chat`;

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

export const requestInitialMessages = () => {
  socket.emit('messages:list');
};

export const getInitialMessages = (callback) => {
  socket.on('messages:list', callback);
};

export const onNewMessage = (callback) => {
  socket.on('messages:new', callback);
};

export const onError = (callback) => {
  socket.on('error', callback);
};

export const sendMessage = (message, replyTo) => {
  socket.emit('messages:new', { message, replyTo });
};

export const sendComplaint = (id) => {
  socket.emit('messages:complaint', id);
};
