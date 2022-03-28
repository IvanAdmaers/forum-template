import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { Paper, Grid, Typography, Button, Box, Divider } from '@mui/material';
import { red, green } from '@mui/material/colors';
import { useSelector, useDispatch } from 'react-redux';

import Design from './Design';
import { Avatar } from 'components/UserUI';

import { changeAvatar as changeUserAvatar } from 'actions/userActions';

import { useFetch, useNotifications } from 'hooks';

const SettingItem = ({ name, children }) => (
  <Grid container sx={{ mb: 1 }}>
    <Grid item>
      <Typography sx={{ mr: 1, fontWeight: 'bold' }}>{name}</Typography>
    </Grid>
    <Grid item>{children}</Grid>
    <Divider sx={{ width: '100%' }} />
  </Grid>
);

SettingItem.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  additionalChildren: PropTypes.node,
};

SettingItem.defaultProps = {
  additionalChildren: null,
};

const Settings = () => {
  const { user, error } = useSelector(({ user }) => user);
  const {
    username,
    email = 'unknown',
    image: userImage,
    isEmailConfirmed,
  } = user;

  const dispatch = useDispatch();

  const notification = useNotifications();

  const [
    {
      error: resendError,
      isLoading: isResendLoading,
      response: resendResponse,
    },
    doResendFetch,
  ] = useFetch('/email/resend');

  const fileInputRef = useRef();

  useEffect(() => {
    if (!error && !resendError) return;

    const text = error || resendError;

    notification(text, 'error');
  }, [notification, error, resendError]);

  useEffect(() => {
    if (!resendResponse) return;

    notification('Email successfully resent', 'success');
  }, [resendResponse, notification]);

  const changeAvatar = () => fileInputRef?.current?.click();

  const handleChangeAvatar = () => {
    const [file] = fileInputRef.current.files;

    notification('Loading image…');

    return dispatch(changeUserAvatar(file, notification));
  };

  const resendMailHandler = () => {
    notification('The mail is being resent…');

    const method = 'POST';

    return doResendFetch({ method });
  };

  const emailConfirmedColor = isEmailConfirmed ? green.A700 : red.A700;

  const isEmailConfirmedText = isEmailConfirmed
    ? 'confirmed'
    : 'unconfirmed';

  const resendEmailConfirmationMailElement = !isEmailConfirmed && (
    <Box>
      <Button
        variant="contained"
        onClick={resendMailHandler}
        disabled={isResendLoading}
      >
        Resend email
      </Button>
      <Typography display="block" variant="caption">
        Check spam folder
      </Typography>
    </Box>
  );

  return (
    <>
      <Paper>
        <Typography component="h1" variant="h6" align="center" gutterBottom>
          Account Information {username}
        </Typography>
        <div>
          <Grid
            container
            direction="column"
            alignItems="center"
            sx={{
              mb: 2,
              textAlign: 'center',
            }}
          >
            <Box sx={{ mb: 0.5 }}>
              <Avatar
                width={72}
                height={72}
                image={userImage}
                username={username}
              />
            </Box>
            <Button onClick={changeAvatar} variant="contained" color="primary">
              Change
            </Button>
            <input
              onChange={handleChangeAvatar}
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
            />
          </Grid>
          <SettingItem name="Username:">
            <Typography>{username}</Typography>
          </SettingItem>
          <SettingItem name="Email:">
            <Typography>{email}</Typography>
          </SettingItem>
          <SettingItem name="Email confirmed:">
            <Typography sx={{ color: emailConfirmedColor }}>
              {isEmailConfirmedText}
            </Typography>
          </SettingItem>
          <Box sx={{ mb: 1 }}>{resendEmailConfirmationMailElement}</Box>
          <div>
            <Box
              component="a"
              href="https://youtu.be/dQw4w9WgXcQ"
              rel="noreferrer nofollow"
              target="_blank"
              sx={{ textDecoration: 'none' }}
            >
              <Button variant="outlined">Deactivate account</Button>
            </Box>
          </div>
        </div>
        <Design />
      </Paper>
    </>
  );
};

export default Settings;
