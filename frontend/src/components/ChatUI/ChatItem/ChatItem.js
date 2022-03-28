import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Badge,
} from '@mui/material';
import { Mail as MailIcon } from '@mui/icons-material';

const ChatItem = ({ id, avatar, username, message, unreadCount, onClick }) => {
  const handleClick = () => {
    onClick(id);
  };

  const unreadCountElement = Boolean(unreadCount) && (
    <Badge badgeContent={unreadCount} color="error">
      <MailIcon />
    </Badge>
  );

  return (
    <ListItem button onClick={handleClick}>
      <ListItemAvatar>
        <Avatar alt={`user ${username} avatar`} src={avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={username}
        secondary={<Typography noWrap>{message}</Typography>}
      />
      {unreadCountElement}
    </ListItem>
  );
};

ChatItem.propTypes = {
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  unreadCount: PropTypes.number,
  onClick: PropTypes.func,
};

ChatItem.defaultProps = {
  unreadCount: 0,
  onClick: () => null,
};

export default ChatItem;
