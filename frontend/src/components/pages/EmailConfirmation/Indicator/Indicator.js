import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import {
  ErrorOutline as ErrorOutlineIcon,
  Done as DoneIcon,
} from '@mui/icons-material';

const Indicator = ({ status }) => {
  const Icon = status === 'error' ? ErrorOutlineIcon : DoneIcon;
  const text =
    status === 'error'
      ? 'Error on confirmation'
      : 'Mail successfully confirmed';

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Icon color="error" sx={{ fontSize: '5rem' }} />
      <Typography variant="h6" align="center">
        {text}
      </Typography>
    </Grid>
  );
};

Indicator.propTypes = {
  status: PropTypes.oneOf(['error', 'success']).isRequired,
};

export default Indicator;
