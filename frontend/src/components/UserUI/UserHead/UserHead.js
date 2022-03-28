import PropTypes from 'prop-types';
import { Grid, Typography, Box } from '@mui/material';

import { Avatar, Separator } from 'components/UserUI';
import MyLink from 'components/MyLink';

import { VerifiedIcon } from 'components/Icons';

import { postDate } from 'utills';

const UserHead = ({ username, image, time, verification }) => {
  const link = `/user/${username}`;

  const date = postDate(time);

  const verificationElement = verification && <VerifiedIcon />;

  return (
    <Grid container wrap="nowrap" alignItems="center">
      <Box sx={{ mr: 0.5 }}>
        <MyLink href={link}>
          <Avatar image={image} username={username} />
        </MyLink>
      </Box>
      <Typography
        component={MyLink}
        href={link}
        color="textSecondary"
        noWrap
        sx={{
          maxWidth: 90,
          mr: 0.1,
        }}
      >
        {username}
      </Typography>
      {verificationElement}
      {Boolean(time) && (
        <>
          <Box sx={{ mr: 0.1 }}>
            <Separator />
          </Box>
          <Typography component="time" color="textSecondary">
            {date}
          </Typography>
        </>
      )}
    </Grid>
  );
};

UserHead.defaultProps = {
  username: '',
  image: '',
  time: 0,
  verification: false,
};

UserHead.propTypes = {
  username: PropTypes.string,
  image: PropTypes.string,
  time: PropTypes.number,
  verification: PropTypes.bool,
};

export default UserHead;
