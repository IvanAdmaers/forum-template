import { Box, Skeleton } from '@mui/material';

const PostItemSkeleton = () => (
  <Box display="flex" alignItems="center" p={1}>
    <Box m={1}>
      <Skeleton variant="circular" width={50} height={50} />
    </Box>
    <Box width="100%">
      <Skeleton width="100%" />
      <Skeleton width="100%" height={60} />
    </Box>
  </Box>
);

export default PostItemSkeleton;
