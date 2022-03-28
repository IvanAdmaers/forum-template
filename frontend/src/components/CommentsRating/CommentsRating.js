import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';

import { CommentsIcon } from 'components/Icons';

import { getPostStatistik } from 'utills';

const CommentsRating = ({ numComments }) => {
  const counter = getPostStatistik(numComments);

  return (
    <Button disableRipple variant="outlined" size="small">
      <CommentsIcon />
      <Typography
        component="p"
        variant="subtitle2"
        color="textSecondary"
        sx={{ ml: 0.5 }}
      >
        {counter}
      </Typography>
    </Button>
  );
};

CommentsRating.defaultProps = {
  numComments: 0,
};

CommentsRating.propTypes = {
  numComments: PropTypes.number,
};

export default CommentsRating;
