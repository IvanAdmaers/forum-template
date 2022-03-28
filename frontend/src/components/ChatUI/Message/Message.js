import PropTypes from 'prop-types';
import { useState } from 'react';
import { Grid, Box, Typography, ButtonBase } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

import MessageActionsMenu from './MessageActionsMenu';
import { Avatar } from 'components/UserUI';

const Message = ({ id, avatarImage, username, text, onReply, onReport }) => {
  const [menuAnchorElement, setMenuAnchorElement] = useState(null);

  const isMenuOpen = Boolean(menuAnchorElement);

  const handleReply = () => {
    handleMenuClose();

    return onReply(id);
  };

  const handleReport = () => {
    handleMenuClose();

    return onReport(id);
  };

  const handleOpenMenu = (e) => {
    setMenuAnchorElement(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorElement(null);
  };

  return (
    <Grid container wrap="nowrap" data-id={id}>
      <ButtonBase
        onClick={handleReply}
        component={Box}
        width="100%"
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Grid item>
          <Box mr={1}>
            <Avatar
              width={24}
              height={24}
              image={avatarImage}
              username={username}
            />
          </Box>
        </Grid>
        <Grid item sx={{ overflow: 'hidden' }}>
          <Typography color="textSecondary" display="inline">
            {username}
          </Typography>
          <Box display="inline" ml={0.5}>
            <Typography display="inline" sx={{ lineHeight: '16px' }}>
              {text}
            </Typography>
          </Box>
        </Grid>
      </ButtonBase>
      <Box ml="auto">
        <Grid item>
          <ButtonBase onClick={handleOpenMenu} centerRipple>
            <MoreVertIcon
              fontSize="small"
              sx={{ color: (theme) => theme.palette.grey[500] }}
            />
          </ButtonBase>
          <MessageActionsMenu
            isOpen={isMenuOpen}
            anchorElement={menuAnchorElement}
            onClose={handleMenuClose}
            onReply={handleReply}
            onReport={handleReport}
          />
        </Grid>
      </Box>
    </Grid>
  );
};

Message.propTypes = {
  id: PropTypes.string.isRequired,
  avatarImage: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onReply: PropTypes.func.isRequired,
  onReport: PropTypes.func.isRequired,
};

export default Message;
