import PropTypes from 'prop-types';
import Image from 'next/image';
import { useEffect, useRef, useMemo } from 'react';
import {
  Paper,
  Container,
  Grid,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { ArrowBackIos as ArrowBackIosIcon } from '@mui/icons-material';

import MyLink from 'components/MyLink';
import { Message, Input, ReplyTo } from 'components/ChatUI';

import { useNotifications } from 'hooks';

const Header = ({ onBack, username, image }) => (
  <>
    <Grid container justifyContent="space-between" alignItems="center">
      <Button onClick={onBack}>
        <ArrowBackIosIcon fontSize="small" />
        Back
      </Button>
      <Box maxWidth={200}>
        <MyLink href={`/user/${username}`}>
          <Typography noWrap>{username}</Typography>
        </MyLink>
      </Box>
      <MyLink href={`/user/${username}`}>
        <Box display="flex" borderRadius="50%" overflow="hidden" mr={1}>
          <Image
            width={30}
            height={30}
            src={image}
            alt={`user ${username} avatar`}
          />
        </Box>
      </MyLink>
    </Grid>
    <Divider />
  </>
);

const Chat = ({
  onBack,
  onReplyTo,
  replyTo,
  messages,
  onSubmit,
  username,
  image,
  currentUserUsername,
  currentUserImage,
  messageLimit,
  message,
  onMessageChange,
}) => {
  const chatRef = useRef();

  const notification = useNotifications();

  const scrollToLastMessages = () =>
    (chatRef.current.scrollTop = chatRef.current.scrollHeight);

  useEffect(() => {
    scrollToLastMessages();
  }, [messages]);

  const handleMessage = (event) => {
    onMessageChange(event);
  };

  const handleSubmit = () => {
    onSubmit();
    // onSubmit(message, replyTo?.id);
    // setMessage('');
    // onReplyTo(null);
  };

  const handleCancelReply = () => {
    onReplyTo(null);
  };

  const handleBack = () => {
    onBack();
  };

  const messageLength = message.length;

  const replyToElement = replyTo && (
    <ReplyTo
      username={replyTo.author.username}
      text={replyTo.message}
      onCancel={handleCancelReply}
      mode="replying"
    />
  );

  const messagesElement = useMemo(() => {
    return messages.map((message) => {
      const { id, message: messageText, author, replyTo } = message;
      const { username, image } = author;

      let repliedToElement = null;

      if (replyTo) {
        const { author: replyToAuthor, message: replyToText } = replyTo;

        const { username: replyToAuthorUsername } = replyToAuthor;

        repliedToElement = (
          <Box mb={0.5}>
            <ReplyTo
              mode="replied"
              username={replyToAuthorUsername}
              text={replyToText}
            />
          </Box>
        );
      }

      const handleReply = (id) => {
        onReplyTo(id);
      };

      const handleReport = () => {
        notification('Feature under development', 'info');
      };

      return (
        <Box key={id} sx={{ mb: 1 }}>
          {repliedToElement}
          <Message
            id={id}
            avatarImage={image}
            username={username}
            text={messageText}
            onReply={handleReply}
            onReport={handleReport}
          />
        </Box>
      );
    });
  }, [messages, notification, onReplyTo]);

  return (
    <Container maxWidth="sm">
      <Paper>
        {username && image && (
          <Header onBack={handleBack} username={username} image={image} />
        )}
        <Box ref={chatRef} height="100vh" overflow="scroll" m={2}>
          {messagesElement}
        </Box>
        <Divider />
        <Box mx={1} mt={0.5} pb={1}>
          <Input
            value={message}
            onChange={handleMessage}
            username={currentUserUsername}
            avatarImage={currentUserImage}
            isSubmitDisabled={false}
            onSubmit={handleSubmit}
            limit={messageLimit}
            length={messageLength}
          >
            {replyToElement}
          </Input>
        </Box>
      </Paper>
    </Container>
  );
};

Chat.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onBack: PropTypes.func,
  onReplyTo: PropTypes.func.isRequired,
  replyTo: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
  ),
  onSubmit: PropTypes.func.isRequired,
  username: PropTypes.string,
  image: PropTypes.string,
  currentUserUsername: PropTypes.string.isRequired,
  currentUserImage: PropTypes.string.isRequired,
  messageLimit: PropTypes.number,
  message: PropTypes.string.isRequired,
  onMessageChange: PropTypes.func.isRequired,
};

Chat.defaultProps = {
  onBack: () => null,
  replyTo: null,
  username: null,
  image: null,
  messageLimit: 500,
};

Header.propTypes = {
  onBack: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default Chat;
