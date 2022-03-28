import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Paper, Typography, Button, Box } from '@mui/material';

import Input from './Input';

import { useNotifications, useFetch } from 'hooks';

const getInputError = (...args) => {
  let errorText = '';

  for (let i = 0; i < args.length; i++) {
    const error = args[i];

    if (!error) continue;

    errorText = error;
    break;
  }

  return errorText;
};

const ResetPassword = ({ type }) => {
  const [value, setValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [
    {
      error: requestError,
      isLoading: isRequestLoading,
      response: requestResponse,
    },
    doRequestFetch,
  ] = useFetch('/password/reset/request');

  const [
    { error: resetError, isLoading: isResetLoading, response: resetResponse },
    doResetFetch,
  ] = useFetch('/password/reset');

  const router = useRouter();

  const notification = useNotifications();

  const inputHandler = ({ target }) => setValue(target.value);

  const showPasswordHandler = () => setShowPassword((prevState) => !prevState);

  const submitHandler = (e) => {
    e.preventDefault();

    if (type === 'request') {
      return resetPasswordRequestSubmit();
    }

    return resetPasswordSubmit();
  };

  // Reset password request submit
  const resetPasswordRequestSubmit = () => {
    const email = value.trim();

    if (!email || email.length < 2 || !email.includes('@')) {
      return notification('Please enter a valid email');
    }

    const body = { user: { email } };

    doRequestFetch({ body });
  };

  // Reset password submit
  const resetPasswordSubmit = () => {
    const password = value;

    if (!password || password.length < 2) {
      return notification('Enter correct password', 'error');
    }

    setShowPassword(false);

    const {
      query: { token },
    } = router;

    const body = { token, user: { password } };

    doResetFetch({ body });
  };

  // Reset password effect
  useEffect(() => {
    if (!resetResponse) return;

    notification('Password changed successfully', 'success');

    router.push('/login');
  }, [resetResponse, notification, router]);

  // Reset password request effect
  useEffect(() => {
    if (!requestResponse) return;

    notification(
      'A password recovery link has been sent to your email',
      'success'
    );

    router.push('/login');
  }, [requestResponse, notification, router]);

  const shouldShowPasswordToggler = type === 'reset';

  const inputError = getInputError(requestError, resetError);

  return (
    <Container maxWidth="sm" component={Paper}>
      <Typography align="center" component="h1" variant="h6" gutterBottom>
        Password recovery
      </Typography>
      <Box
        component="form"
        onSubmit={submitHandler}
        autoComplete="off"
        sx={{
          py: 1,
          px: 'auto',
        }}
      >
        <Input
          type={type}
          value={value}
          error={inputError}
          onChange={inputHandler}
          showPasswordToggler={shouldShowPasswordToggler}
          showPassword={showPassword}
          onShowPassword={showPasswordHandler}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isRequestLoading || isResetLoading}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

ResetPassword.propTypes = {
  type: PropTypes.oneOf(['request', 'reset']).isRequired,
};

export default ResetPassword;
