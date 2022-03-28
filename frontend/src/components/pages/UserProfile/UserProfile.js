import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Divider,
  Box,
  Button,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';

import MyLink from 'components/MyLink';
import UserProfileHead from './UserProfileHead';
import PostsList from 'components/PostsList';
import Verification from 'components/Verification';
import BanAction from 'components/BanAction';

import { USER_BOSS_ROLE } from 'constants/user';

const UserProfile = ({ user }) => {
  const [postsUrl, setPostsUrl] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(
    user.verification.status
  );

  const currentUserRoles = useSelector(({ user }) => user?.user?.roles);
  const currentUserUsername = useSelector(({ user }) => user?.user?.username);

  const allowVerificationAction =
    currentUserRoles && currentUserRoles.includes(USER_BOSS_ROLE);

  const { id, username, image, createdAt, verification, ban } = user;
  const verificationMessage = verification.message;
  const { status: banStatus } = ban;

  const shouldShowCreatePostButton = currentUserUsername === username;

  useEffect(() => {
    if (!username || postsUrl) return;

    setPostsUrl(`/users/posts/${username}`);
  }, [postsUrl, username]);

  const handleVerificationChange = useCallback((status) => {
    setTimeout(() => {
      setVerificationStatus(status);
    }, 0);
  }, []);

  const isAvailableToWriteMessage =
    currentUserUsername && currentUserUsername !== username;

  return <>
    <Paper>
      <UserProfileHead
        username={username}
        image={image}
        createdAt={createdAt}
        verified={verificationStatus}
        verifiedMessage={verificationMessage}
        hasBan={banStatus}
      />
      {allowVerificationAction && (
        <Grid container justifyContent="center">
          <Box mb={1}>
            <Verification
              verification={verificationStatus}
              type="user"
              id={id}
              onChange={handleVerificationChange}
            />
          </Box>
        </Grid>
      )}
      {allowVerificationAction && !banStatus && (
        <Grid container justifyContent="center">
          <Box mb={1}>
            <BanAction type="user" id={id} />
          </Box>
        </Grid>
      )}
      {isAvailableToWriteMessage && (
        <Grid container justifyContent="center">
          <Box mb={1}>
            <MyLink href={`/chats?interlocutor=${id}&username=${username}&image=${image}`}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => 1}
            >
              To write a message
              <Box display="flex" ml={1}>
                <SendIcon fontSize="small" />
              </Box>
            </Button>
            </MyLink>
          </Box>
        </Grid>
      )}
    </Paper>
    <Divider light />
    <Paper>
      <PostsList
        url={postsUrl}
        showCreatePostButton={shouldShowCreatePostButton}
      />
    </Paper>
  </>;
};

UserProfile.propTypes = {
  user: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object])
  ).isRequired,
};

export default UserProfile;
