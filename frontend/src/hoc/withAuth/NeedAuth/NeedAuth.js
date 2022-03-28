import { Grid, Button, Typography } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

import MyLink from 'components/MyLink';

const NeedAuth = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      sx={{
        pt: 2,
      }}
    >
      <LockIcon fontSize="large" />
      <Typography component="h1" variant="h6" gutterBottom>
        Please,{' '}
        <MyLink color="primary" href="/login">
          log in
        </MyLink>{' '}
        or{' '}
        <MyLink color="primary" href="/sign-up">
          sign up
        </MyLink>{' '}
        to access this page
      </Typography>
      <MyLink href="/">
        <Button color="primary" variant="contained">
          To the main
        </Button>
      </MyLink>
    </Grid>
  );
};

export default NeedAuth;
