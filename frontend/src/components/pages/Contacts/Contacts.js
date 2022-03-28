import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Paper, Box, Typography, Grid, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useFetch, useNotifications } from 'hooks';

const ReCaptcha2 = dynamic(() =>
  import('components/ReCaptcha').then(({ ReCaptcha2 }) => ReCaptcha2)
);

const Contacts = () => {
  const [contactsInfo, setContactsInfo] = useState('');
  const [{ error, response, isLoading }, doFetch] = useFetch(
    '/interaction/contacts'
  );

  const notification = useNotifications();

  const theme = useTheme().palette.mode;

  useEffect(() => {
    if (!error) {
      return;
    }

    notification(error, 'error');
  }, [error, notification]);

  useEffect(() => {
    if (!response) {
      return;
    }

    setContactsInfo(response.contacts);
  }, [response]);

  const handleSubmit = () => {
    notification('Captcha failed', 'error');
  };

  const handleReCaptcha = (token) => {
    const body = { token };

    doFetch({ body });
  };

  const requestContactsElement = (
    <>
      <Grid container justifyContent="center">
        <ReCaptcha2 onChange={handleReCaptcha} theme={theme} />
      </Grid>
      <Typography>Please pass the captcha</Typography>
      <Box mb={1} />
      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        variant="contained"
        color="primary"
      >
        Get contacts
      </Button>
    </>
  );

  const contactsInfoElement = <Typography>{contactsInfo}</Typography>;

  return (
    <Paper>
      <Box textAlign="center" p={1} minHeight="100vh">
        <Typography component="h1" variant="h6" gutterBottom>
          Contacts
        </Typography>
        {!contactsInfo ? requestContactsElement : contactsInfoElement}
      </Box>
    </Paper>
  );
};

export default Contacts;
