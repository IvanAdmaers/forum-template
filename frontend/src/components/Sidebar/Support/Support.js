import PropTypes from 'prop-types';
import { Button, Typography, Grid, Link } from '@mui/material';

const Support = ({ url }) => {
  return (
    <>
      <Typography align="center" component="h4" gutterBottom noWrap>
        Support us
      </Typography>
      <Grid container justifyContent="center">
        <Link href={url} rel="noreferrer" target="_blank" underline="none">
          <Button variant="contained" color="secondary">
            Support
          </Button>
        </Link>
      </Grid>
    </>
  );
};

Support.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Support;
