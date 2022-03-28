import { Grid, Typography } from '@mui/material';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

const EmptyQuery = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      sx={{ minHeight: '100vh' }}
    >
      <ErrorOutlineIcon color="error" fontSize="large" />
      <Typography component="h1" variant="h6">
        An empty search term has been set
      </Typography>
    </Grid>
  );
};

export default EmptyQuery;
