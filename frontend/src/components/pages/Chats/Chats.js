import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Paper, Typography, Container } from '@mui/material';

import { Chat, ChatItem } from 'components/ChatUI';
import { MessageSkeleton } from 'components/Skeletons';

import { useFetch, useNotifications } from 'hooks';

import { setCurrentChatInterlocutorId } from 'actions/personalActions';

import * as socket from 'sockets/privateChatsSocket';

import { createFakeArray } from 'utills';

const NoChats = () => (
  <Box
    minHeight="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Typography>No chats yet</Typography>
  </Box>
);

const Chats = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [chats, setChats] = useState(null);
  const [chatMessages, setChatMessages] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [message, setMessage] = useState('');

  const currentChatInterlocutorId = useSelector(
    ({ personal }) => personal.currentChatInterlocutorId
  );
  const currentUser = useSelector(({ user }) => user.user);

  const [{ error, response }, doFetch] = useFetch(
    '/request-socket-connection?type=private-chats'
  );

  const dispatch = useDispatch();

  const notification = useNotifications();

  const router = useRouter();

  useEffect(() => {
    const method = 'GET';

    doFetch({ method });
  }, [doFetch]);

  // Sockets
  useEffect(() => {
    if (!response) {
      return;
    }

    socket.connectSocket();

    /* handleSocketConnected */
    const handleSocketConnected = () => {
      socket.getChatList();
      setSocketConnected(true);
    };

    socket.socketConneced(handleSocketConnected);
    /* handleSocketConnected end */

    /* handleChatList */
    const handleChatList = (chatList = []) => {
      setChats(chatList);
    };

    socket.chatList(handleChatList);
    /* handleChatList end */

    /* handleUpdateChatsTrigger */
    const handleUpdateChatsTrigger = () => {
      socket.getChatList();
    };

    socket.updateChatListTrigger(handleUpdateChatsTrigger);
    /* handleUpdateChatsTrigger end */

    /* handleChatMessages */
    const handleChatMessages = (messages = []) => {
      setChatMessages(messages);
    };

    socket.chatMessages(handleChatMessages);
    /* handleChatMessages end */

    /* handleNewChatMessage */
    const handleNewChatMessage = (message = {}) => {
      setChatMessages((prevState) => [...prevState, message]);
    };

    socket.newChatMessage(handleNewChatMessage);
    /* handleNewChatMessage end */

    /* handleError */
    const handleError = (error = '') => {
      return notification(error, 'error');
    };

    socket.error(handleError);

    return () => {
      socket.disconnectSocket();
      setCurrentChatInterlocutorId(null);
    };
  }, [response, notification]);
  /* handleError end */

  // useEffect for `handleUpdateChatsTrigger`
  useEffect(() => {
    if (!currentChatInterlocutorId || !socketConnected) {
      return;
    }

    socket.requestChat(currentChatInterlocutorId);
  }, [currentChatInterlocutorId, socketConnected]);

  // useEffect for `handleNewChatMessage`
  useEffect(() => {
    if (!chatMessages?.length || !currentChatInterlocutorId) {
      return;
    }

    socket.markChatAsRead(currentChatInterlocutorId);
  }, [chatMessages, currentChatInterlocutorId]);

  const interlocutorId = router.query.interlocutor;

  // Set current chat interlocutor id
  useEffect(() => {
    const value = !interlocutorId ? null : interlocutorId;

    dispatch(setCurrentChatInterlocutorId(value));
  }, [interlocutorId, dispatch]);

  //
  useEffect(() => {
    // const isChatWithInterlocutor = chats?.find(
    //   ({ interlocutor }) => interlocutor.id === currentChatInterlocutorId
    // );

    if (
      !chats?.length ||
      !Array.isArray(chatMessages) ||
      chatMessages?.length ||
      !currentChatInterlocutorId
    ) {
      return;
    }

    socket.requestChat(currentChatInterlocutorId);
  }, [chats, chatMessages, currentChatInterlocutorId]);

  const handleChatRequest = (id = '') => {
    router.push({ query: { interlocutor: id } });
  };

  const handleBack = () => {
    socket.getChatList();
    socket.leaveChat();
    setChatMessages(null);
    dispatch(setCurrentChatInterlocutorId(null));
    router.back();
  };

  const handleSubmit = () => {
    if (!message) {
      notification('Enter your message');
      return;
    }

    if (message.length > messageLimit) {
      notification('Message is too long');
      return;
    }

    socket.sendMessage(currentChatInterlocutorId, message, replyTo?.id);
    setMessage('');
    setReplyTo(null);
  };

  const handleReplyTo = (id) => {
    if (!id) {
      setReplyTo(null);
      return;
    }

    const message = chatMessages.find((messageItem) => messageItem.id === id);

    setReplyTo(message);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const messageLimit = 500;

  const chatsElement =
    chats &&
    chats.map((chat) => {
      const { interlocutor, lastMessage, hasUnreadMessages } = chat;
      const { id, username, image } = interlocutor;
      const { message, author } = lastMessage;
      const lastMessageAuthor = author.username;

      const unreadCount = hasUnreadMessages ? 1 : 0;
      const messageText = `${lastMessageAuthor}: ${message}`;

      return (
        <ChatItem
          key={id}
          id={id}
          avatar={image}
          username={username}
          message={messageText}
          unreadCount={unreadCount}
          onClick={handleChatRequest}
        />
      );
    });

  if (chatMessages && currentChatInterlocutorId) {
    const chat = chats?.find(
      ({ interlocutor }) => interlocutor.id === currentChatInterlocutorId
    );

    const { username, image } = chat?.interlocutor || {};

    const interlocutorUsername = username || router.query.username;
    const interlocutorImage = image || router.query.image;

    return (
      <Chat
        username={interlocutorUsername}
        image={interlocutorImage}
        currentUserUsername={currentUser.username}
        currentUserImage={currentUser.image}
        onBack={handleBack}
        messages={chatMessages}
        onSubmit={handleSubmit}
        replyTo={replyTo}
        onReplyTo={handleReplyTo}
        messageLimit={messageLimit}
        message={message}
        onMessageChange={handleMessageChange}
      />
    );
  }

  return (
    <Container maxWidth="sm">
      <Box component={Paper} minHeight="100vh">
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Chats
        </Typography>
        {chats && !chats.length && !error && <NoChats />}
        {!response &&
          createFakeArray(10).map((id) => (
            <Box key={`chat-skeleton-${id}`} mb={2}>
              <MessageSkeleton />
            </Box>
          ))}
        {chatsElement}
        <Box pb={1} />
      </Box>
    </Container>
  );
};

export default Chats;
