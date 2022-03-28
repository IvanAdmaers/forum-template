import { Grid, Typography } from '@mui/material';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

const NSFW = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ width: 'max-content' }}
    >
      <ErrorOutlineIcon fontSize="small" color="error" />
      <Typography
        component="span"
        color="error"
        sx={{
          ml: 0.1,
          textTransform: 'uppercase',
        }}
      >
        NSFW
      </Typography>
    </Grid>
  );
};

export default NSFW;
