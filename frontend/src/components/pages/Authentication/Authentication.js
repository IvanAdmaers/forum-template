import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useDebouncedCallback } from 'use-debounce';
import { useSelector, useDispatch } from 'react-redux';

import MyLink from 'components/MyLink';
import { signIn, signUp } from 'actions/userActions';
import { useFetch, useNotifications } from 'hooks';
import { randomArrayItem } from 'utills';

const Agreement = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      By continuing, you agree to our{' '}
      <MyLink
        underline="always"
        href="/policies/user-agreement"
        target="_blank"
      >
        User Agreement
      </MyLink>
      ,{' '}
      <MyLink
        underline="always"
        href="/policies/privacy-policy"
        target="_blank"
      >
        Privacy Policy{' '}
      </MyLink>
      and{' '}
      <MyLink underline="always" href="/policies/cookie-notice" target="_blank">
        Cookie Notice
      </MyLink>
      .
    </Typography>
  );
};

const getBackgroundImage = () => {
  const imagesNumber = 3;
  const arr = Array(imagesNumber)
    .fill('_')
    .map((_, index) => index + 1);

  const imageNumber = randomArrayItem(arr);

  return `url("/images/authentication/bg${imageNumber}.jpg")`;
};

const Authentication = ({ isLogIn }) => {
  const [user, setUser] = useState({
    email: '',
    emailError: '',
    username: '',
    usernameError: '',
    password: '',
    passwordError: '',
  });
  const [backgroundImage] = useState(getBackgroundImage());

  // const [rememberMe, setRememberMe] = useState(true);
  const [hasErrors, setHasErrors] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const theme = useTheme();

  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const router = useRouter();

  const dispatch = useDispatch();

  // User redux
  const userData = useSelector(({ user }) => user);

  // Looking for user error
  useEffect(() => {
    if (!userData.error) return;

    setError(userData.error);
  }, [userData]);

  const notifications = useNotifications();

  const showPasswordHandler = () => setShowPassword((prevState) => !prevState);

  useEffect(() => {
    if (isLogIn) return;

    const hasErrorsFields = () => {
      const has = Object.entries(user).some(
        ([key, value]) => key.match(/Error/) && value
      );

      !has ? setHasErrors(false) : setHasErrors(true);
    };

    hasErrorsFields();
  }, [user, isLogIn]);

  const [
    { isLoading: isCheckEmailLoading, error: checkEmailError },
    doCheckEmailFetch,
  ] = useFetch('/checks/email');

  const [
    { isLoading: isCheckUsernameLoading, error: checkUsernameError },
    doCheckUsernameFetch,
  ] = useFetch('/checks/username');

  // Text
  const actionText = isLogIn ? 'Login' : 'Sign up';
  const alternativeActionText = isLogIn
    ? 'Don\'\t have an account? Sign up'
    : 'Have an account? Login';
  const alternativeActionLink = isLogIn ? '/sign-up' : '/login';

  // onChange input handler
  const inputHandler = ({ target }) => {
    const { name, value } = target;
    const error = `${name}Error`;

    setError(null);
    setUser((prevState) => ({ ...prevState, [name]: value, [error]: '' }));
  };

  // Checks
  const checkParam = (param = '') => {
    const userData = { user: { [param]: user[param] } };

    if (param === 'email') {
      doCheckEmailFetch({ body: userData });
    }

    if (param === 'username') {
      doCheckUsernameFetch({ body: userData });
    }
  };

  const debouncedCheckEmail = useDebouncedCallback(
    () => checkParam('email'),
    500
  );
  const debouncedCheckUsername = useDebouncedCallback(
    () => checkParam('username'),
    500
  );

  useEffect(() => {
    if (!user.email || isLogIn) return;

    debouncedCheckEmail();
  }, [user.email, debouncedCheckEmail, isLogIn]);

  useEffect(() => {
    if (!user.username || isLogIn) return;

    debouncedCheckUsername();
  }, [user.username, debouncedCheckUsername, isLogIn]);

  // Set error
  useEffect(() => {
    if (!checkEmailError) return;

    setUser((prevState) => ({ ...prevState, emailError: checkEmailError }));

    return () => {
      setUser((prevState) => ({ ...prevState, emailError: '' }));
    };
  }, [checkEmailError, isCheckEmailLoading]);

  useEffect(() => {
    if (!checkUsernameError) return;

    setUser((prevState) => ({
      ...prevState,
      usernameError: checkUsernameError,
    }));

    return () => {
      setUser((prevState) => ({ ...prevState, usernameError: '' }));
    };
  }, [checkUsernameError, isCheckUsernameLoading]);

  // Submit handler
  const submitHandler = (e) => {
    e.preventDefault();

    setShowPassword(false);

    const { email, username, password } = user;

    if (!username || !password || (!isLogIn && !email)) {
      return notifications('Fill in all the fields', 'error');
    }

    // Sign up
    if (!isLogIn) {
      return dispatch(signUp(email, username, password, router));
    }

    // Sign in
    return dispatch(signIn(username, password, router));
  };

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={false}
        md={7}
        sx={{
          backgroundImage,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[50]
              : theme.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={12} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {actionText}
          </Typography>
          <Box
            component="form"
            onSubmit={submitHandler}
            sx={{ mt: 1 }}
            noValidate
          >
            {!isLogIn && (
              <TextField
                onChange={inputHandler}
                value={user.email}
                error={!!user.emailError}
                helperText={!user.emailError ? '' : user.emailError}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
            )}
            <TextField
              onChange={inputHandler}
              value={user.username}
              error={!!user.usernameError}
              helperText={!user.usernameError ? '' : user.usernameError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete={isLogIn ? 'username' : 'off'}
            />
            <TextField
              onChange={inputHandler}
              value={user.password}
              error={!!user.passwordError}
              helperText={!user.passwordError ? '' : user.passwordError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete={isLogIn ? 'password' : 'off'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={showPasswordHandler}
                      size="large"
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={hasErrors || userData.loading}
            >
              {actionText}
            </Button>
            <Grid
              container
              direction={matches ? 'column' : 'row'}
              alignItems={matches ? 'center' : 'baseline'}
            >
              <Grid item xs>
                <MyLink href="/reset-password" variant="body2">
                  Forgot your password?
                </MyLink>
              </Grid>
              <Grid item>
                <MyLink href={alternativeActionLink} variant="body2">
                  {alternativeActionText}
                </MyLink>
              </Grid>
            </Grid>
            {!isLogIn && (
              <Box mt={5}>
                <Agreement />
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

Authentication.defaultProps = {
  isLogIn: false,
};

Authentication.propTypes = {
  isLogIn: PropTypes.bool,
};

export default Authentication;
