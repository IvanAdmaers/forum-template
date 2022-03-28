import PropTypes from 'prop-types';
import { Grid, Box, Skeleton } from '@mui/material';

const MessageSkeleton = ({ avatarWidth, avatarHeight, textHeight }) => {
  return (
    <Grid container wrap="nowrap">
      <Box mr={1}>
        <Skeleton variant="circular" width={avatarWidth} height={avatarHeight} />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={textHeight} />
    </Grid>
  );
};

MessageSkeleton.defaultProps = {
  avatarWidth: 24,
  avatarHeight: 24,
  textHeight: 24,
};

MessageSkeleton.propTypes = {
  avatarWidth: PropTypes.number,
  avatarHeight: PropTypes.number,
  textHeight: PropTypes.number,
};

export default MessageSkeleton;
