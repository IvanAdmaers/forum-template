import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';

import MyLink from 'components/MyLink';

import { PostItemSkeleton } from 'components/Skeletons';

import { createFakeArray } from 'utills';

const Info = ({ text, children }) => (
  <Grid
    component={Box}
    minHeight="60vh"
    container
    justifyContent="center"
    alignItems="center"
    direction="column"
  >
    <Typography gutterBottom={Boolean(children)}>{text}</Typography>
    {children}
  </Grid>
);

Info.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Info.defaultProps = {
  children: null,
};

const getContent = ({
  page,
  pages,
  isLoading,
  postsLength,
  limit,
  showCreatePostButton,
}) => {
  if (isLoading) {
    return createFakeArray(limit).map((id) => (
      <PostItemSkeleton key={`post-item-skeleton-loading-${id}`} />
    ));
  }

  const createPostElement = (
    <MyLink href="/post/create">
      <Button variant="contained" color="primary">
        Create
      </Button>
    </MyLink>
  );

  if (postsLength === 0) {
    return (
      <Info text="No posts yet">
        {showCreatePostButton && createPostElement}
      </Info>
    );
  }

  if (page >= pages) {
    return (
      <Info text="No more posts">
        {showCreatePostButton && createPostElement}
      </Info>
    );
  }

  return <Info text="Loading" />;
};

const LastPostsElement = forwardRef(
  (
    { page, pages, isLoading, postsLength, limit, showCreatePostButton },
    ref
  ) => {
    const content = getContent({
      page,
      pages,
      isLoading,
      postsLength,
      limit,
      showCreatePostButton,
    });

    return <div ref={ref}>{content}</div>;
  }
);

LastPostsElement.displayName = 'LastPostsElement';

LastPostsElement.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.any,
  isLoading: PropTypes.bool.isRequired,
  postsLength: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  showCreatePostButton: PropTypes.bool,
};

LastPostsElement.defaultProps = {
  showCreatePostButton: false,
};

export default LastPostsElement;
