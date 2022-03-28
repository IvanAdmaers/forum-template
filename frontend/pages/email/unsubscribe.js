import { Paper, Grid, Typography, Box } from '@mui/material';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';

import MyHead from 'components/MyHead';

import { getTitle } from 'utills';

const Unsubscribe = () => {
  const title = getTitle('Mail receiving settings');
  const description = 'Your description is here';

  return <>
    <MyHead title={title} description={description} noIndex />
    <Paper>
      <Grid
        component={Box}
        minHeight="100vh"
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Box mb={1}>
          <AccessTimeIcon fontSize="large" color="primary" />
        </Box>
        <Typography component="h1" variant="h5">
          In developing
        </Typography>
      </Grid>
    </Paper>
  </>;
};

export default Unsubscribe;
