import { useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { Chat } from 'components/ChatUI';

import {
  setMessage,
  setReplyToMessage,
  cancelReplyToMessage,
  setMessagesList,
  addMessage,
  messageWasSent,
} from 'actions/globalChatActions';

import { useFetch, useNotifications } from 'hooks';

// Sockets
import * as socket from 'sockets/globalChatSocket';

const GlobalChat = () => {
  const { image: userImage, username } = useSelector(({ user }) => user.user);
  const { messagesList, message, replyTo } = useSelector(
    ({ globalChat }) => globalChat
  );

  const [
    {
      error: requestSocketConnectionError,
      response: requestSocketConnectionResponse,
    },
    doRequestSocketConnectionFetch,
  ] = useFetch('/request-socket-connection?type=global');

  const dispatch = useDispatch();

  const notification = useNotifications();

  useEffect(() => {
    const method = 'GET';

    doRequestSocketConnectionFetch({ method });
  }, [doRequestSocketConnectionFetch]);

  useEffect(() => {
    if (!requestSocketConnectionError) {
      return;
    }

    notification(requestSocketConnectionError, 'error');
  }, [requestSocketConnectionError, notification]);

  useEffect(() => {
    if (!requestSocketConnectionResponse) {
      return;
    }

    socket.connectSocket();

    const handleSocketConnected = () => {
      socket.requestInitialMessages();
    };

    socket.socketConneced(handleSocketConnected);

    // Handle getting the messages list
    const getInitialMessagesCallback = (messagesList = []) => {
      dispatch(setMessagesList(messagesList));
      // return scrollToLastMessages();
    };

    socket.getInitialMessages(getInitialMessagesCallback);

    // Handle a new message
    const handleNewMessageCallback = (message = {}) => {
      dispatch(addMessage(message));
      // return scrollToLastMessages();
    };

    socket.onNewMessage(handleNewMessageCallback);

    // Handle error
    const handleErrorCallback = (error = '') => notification(error, 'error');

    socket.onError(handleErrorCallback);

    return () => socket.disconnectSocket();
  }, [requestSocketConnectionResponse, dispatch, notification]);

  const handleMessageChange = (event) => {
    dispatch(setMessage(event.target.value));
  };

  const handleReplyTo = (id) => {
    if (!id) {
      handleCancelReply();
      return;
    }

    const message = messagesList.find((messageItem) => messageItem.id === id);

    dispatch(setReplyToMessage(message));
  };

  const handleCancelReply = () => {
    dispatch(cancelReplyToMessage());
  };

  const handleMessageSubmit = () => {
    if (!message.trim().length) {
      notification('Enter your message', 'error');
      return;
    }

    if (message.length > messageLimit) {
      notification('Message is too long', 'error');
      return;
    }

    socket.sendMessage(message, replyTo?.id);
    handleCancelReply();
    dispatch(setMessage(''));
    dispatch(messageWasSent());
  };

  const messageLimit = 200;

  return (
    <Paper>
      <Box pt={2} pb={2}>
        <Typography align="center" component="h1" variant="h5">
          General chat
        </Typography>
      </Box>
      <Box
        sx={{
          pb: 2,
        }}
      >
        <Chat
          messages={messagesList}
          currentUserUsername={username}
          currentUserImage={userImage}
          onSubmit={handleMessageSubmit}
          onReplyTo={handleReplyTo}
          replyTo={replyTo}
          messageLimit={messageLimit}
          message={message}
          onMessageChange={handleMessageChange}
        />
      </Box>
    </Paper>
  );
};

export default GlobalChat;
