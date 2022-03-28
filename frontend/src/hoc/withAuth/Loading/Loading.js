import { Grid, CircularProgress } from '@mui/material';


const Loading = () => {
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
      <CircularProgress size="5rem" />
    </Grid>
  );
};

export default Loading;
