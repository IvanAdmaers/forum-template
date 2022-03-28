import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, CircularProgress } from '@mui/material';

import Indicator from './Indicator';

import { useFetch } from 'hooks';

const EmailConfirmation = () => {
  const { query } = useRouter();

  const [{ error, response }, doFetch] = useFetch('/email/confirmation');

  useEffect(() => {
    const { token } = query;

    if (!token) return;

    const body = { token };

    doFetch({ body });
  }, [doFetch, query]);

  const loadingIndicatorElement = !error && !response && (
    <CircularProgress sx={{ fontSize: '5rem' }} />
  );

  const errorIdicatorElement = error && <Indicator status="error" />;

  const successIdicatorElement = response && <Indicator status="success" />;

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        width: '100%',
        height: '100vh',
      }}
    >
      {loadingIndicatorElement}
      {errorIdicatorElement}
      {successIdicatorElement}
    </Grid>
  );
};

export default EmailConfirmation;
