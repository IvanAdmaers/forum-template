import { Grid, CircularProgress } from '@mui/material';

const Loading = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '100vh' }}
    >
      <CircularProgress />
    </Grid>
  );
};

export default Loading;
