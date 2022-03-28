import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

import Comment from 'components/pages/PostPage/Comment';
import AddComment from '../AddComment';

import widthNeedAuth from 'hoc/withNeedAuth';

import { useFetch, useNotifications } from 'hooks';

/**
 * This function renders comments to jsx
 *
 * @param {object} comment
 * @returns {JSX} Comment JSX
 */
const getCommentElement = (comment, onNeedAuth, submitComment, loading) => {
  const { id, body, parentId } = comment.comment;
  const { username, image, verification } = comment.author;
  const { rating, userVote } = comment.rating;

  if (comment.children) {
    const children = comment.children.map((childrenComment) => {
      return getCommentElement(
        childrenComment,
        onNeedAuth,
        submitComment,
        loading
      );
    });

    const marginLeft = 20;

    return (
      <div key={`post-comments-group-parent-${id}`}>
        <Comment
          username={username}
          profileImage={image}
          verification={verification}
          HTML={body}
          openNeedAuthPopup={onNeedAuth}
          onSubmit={submitComment}
          loading={loading}
          parentId={parentId}
          commentId={id}
          rating={rating}
          userVote={userVote}
        />
        <div style={{ marginLeft }}>{children}</div>
      </div>
    );
  }

  return (
    <Comment
      key={`post-comment-${id}`}
      username={username}
      profileImage={image}
      verification={verification}
      HTML={body}
      openNeedAuthPopup={onNeedAuth}
      onSubmit={submitComment}
      loading={loading}
      parentId={parentId}
      commentId={id}
      rating={rating}
      userVote={userVote}
    />
  );
};

const PostComments = ({
  isLoading,
  comments,
  popupElement,
  openPopup,
  onNewComment,
}) => {
  const [didMount, setDidMount] = useState(false);

  const notification = useNotifications();

  const router = useRouter();

  useEffect(() => {
    if (didMount) return;

    setDidMount(true);
  }, [didMount]);

  const isLoggedIn = useSelector(({ user }) => user.isLoggedIn);

  // Submit comment fetch
  const { slug } = router.query;

  const [
    {
      error: submitCommentError,
      isLoading: submitCommentIsLoading,
      response: submitCommentResponse,
    },
    doSubmitCommentFetch,
  ] = useFetch(`/comments/${slug}`);

  // Submit comment error
  useEffect(() => {
    if (!submitCommentError) return;

    notification(submitCommentError, 'error');
  }, [submitCommentError, notification]);

  // Submit comment response
  useEffect(() => {
    if (!submitCommentResponse) return;

    onNewComment(submitCommentResponse);

    notification('Comment added successfully', 'success');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCommentResponse, notification]);

  const handleSubmitComment = (parentId, commentData = {}) => {
    if (!isLoggedIn) {
      return openPopup();
    }

    if (!commentData.blocks.length) {
      return notification('Enter a comment', 'error');
    }

    const method = 'POST';

    const comment = {
      parentId,
      body: commentData,
    };

    return doSubmitCommentFetch({ method, body: { comment } });
  };

  const commentsElement = comments.map((comment) => {
    return getCommentElement(
      comment,
      openPopup,
      handleSubmitComment,
      submitCommentIsLoading
    );
  });

  if (isLoading) {
    return (
      <Grid
        container
        justifyContent="center"
        sx={{
          py: 2,
        }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  const addNewCommentElement = (
    <AddComment
      onSubmit={handleSubmitComment}
      isLoading={submitCommentIsLoading}
    />
  );

  return (
    <>
      {didMount && addNewCommentElement}
      {commentsElement}
      {popupElement}
    </>
  );
};

PostComments.defaultProps = {
  isLoading: false,
  onNewComment: () => null,
};

PostComments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool,
  popupElement: PropTypes.element.isRequired,
  openPopup: PropTypes.func.isRequired,
  onNewComment: PropTypes.func,
};

export default widthNeedAuth(PostComments);
