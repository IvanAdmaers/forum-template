import PropTypes from 'prop-types';
import { useState } from 'react';
import { Grid, Typography, Popover, Box } from '@mui/material';

import { Avatar, BanMarker } from 'components/UserUI';
import MyLink from 'components/MyLink';

import { userJoinedTime } from 'utills';

import { VerifiedIcon } from 'components/Icons';

const UserProfileHead = ({
  username,
  image,
  createdAt,
  verified,
  verifiedMessage,
  hasBan,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);
  const popoverId = isPopoverOpen ? 'verification-popover' : undefined;

  const joinedTime = userJoinedTime(createdAt);

  const verifiedElement = (
    <>
      <Box sx={{ ml: 1 }}>
        <VerifiedIcon onClick={handleClick} />
      </Box>
      <Popover
        id={popoverId}
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography>{verifiedMessage}</Typography>
      </Popover>
    </>
  );

  const banElement = <BanMarker />;

  return (
    <Box sx={{ py: 1 }}>
      <Grid container justifyContent="center">
        <Avatar image={image} width={60} height={60} username={username} />
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <Typography
          display="block"
          align="center"
          component="h1"
          variant="h6"
          color="textSecondary"
          noWrap
        >
          <MyLink href={`/user/${username}`}>user/{username}</MyLink>
        </Typography>
        {verified && verifiedElement}
        {hasBan && banElement}
      </Grid>
      <Typography component="h2" align="center" variant="body2">
        &#127881; Already <strong>{joinedTime}</strong> with us &#127881;
      </Typography>
    </Box>
  );
};

UserProfileHead.defaultProps = {
  verified: false,
  verifiedMessage: '',
  hasBan: false,
};

UserProfileHead.propTypes = {
  username: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  verified: PropTypes.bool,
  verifiedMessage: PropTypes.string,
  hasBan: PropTypes.bool,
};

export default UserProfileHead;
