import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, CircularProgress } from '@mui/material';

import { useDispatch } from 'react-redux';

import { logoutUser } from 'actions/userActions';

const Logout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser(router));
  }, [dispatch, router]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '100vh' }}
    >
      <CircularProgress size="5rem" />
    </Grid>
  );
};

export default Logout;
