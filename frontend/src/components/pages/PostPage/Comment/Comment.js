import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Grid, ButtonBase, Divider, Box } from '@mui/material';
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';

import { UserHead } from 'components/UserUI';
import Rating from 'components/Rating';
import { CommentsIcon } from 'components/Icons';
import AddComment from '../AddComment';
import DropdownMenu from './DropdownMenu';

import { useNotifications } from 'hooks';

import { voteComment } from 'api';

import { openComplaintPopup } from 'actions/complaintActions';

const Comment = ({
  username,
  profileImage,
  verification,
  HTML,
  openNeedAuthPopup,
  parentId,
  commentId,
  rating,
  userVote: currentUserVote,
  onSubmit,
  loading,
}) => {
  const [showAddComment, setShowAddComment] = useState(false);
  const [userVote, setUserVote] = useState(currentUserVote);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const dispatch = useDispatch();

  const { status } = verification;

  useEffect(() => {
    if (!currentUserVote) return;

    setUserVote(currentUserVote);
  }, [currentUserVote]);

  const isLoggedIn = useSelector(({ user }) => user.isLoggedIn);

  const notification = useNotifications();

  const router = useRouter();

  const { slug } = router.query;

  const handleAddComment = () => {
    if (!isLoggedIn) return openNeedAuthPopup();

    setShowAddComment((prevState) => !prevState);
  };

  // User vote
  const handleUserVote = async (vote) => {
    if (!isLoggedIn) return openNeedAuthPopup();

    try {
      await voteComment(slug, commentId, vote);
    } catch (e) {
      console.log(e);
      notification('Failed to rate comment', 'error');
    }
  };

  // Menu
  const handleOpenMenu = (e) => setMenuAnchorEl(e.currentTarget);

  const handleCloseMenu = () => setMenuAnchorEl(null);

  const allowComplaint = isLoggedIn;

  // Open complaint popup
  const handleOpenComplaintPopup = () =>
    dispatch(openComplaintPopup('comment', commentId));

  const addCommentElement = showAddComment ? (
    <Box sx={{ width: 270, my: 1 }}>
      <AddComment
        editorId={commentId}
        onSubmit={onSubmit}
        isLoading={loading}
      />
    </Box>
  ) : null;

  const ratingElement = (
    <Rating
      score={rating}
      voteState={userVote}
      onVote={handleUserVote}
      isLoggedIn={isLoggedIn}
      openPopup={openNeedAuthPopup}
    />
  );

  return (
    <>
      <Grid
        data-parent-id={parentId}
        data-comment-id={commentId}
        container
        sx={{ p: 1 }}
      >
        <Grid container wrap="nowrap" justifyContent="space-between">
          <UserHead
            username={username}
            image={profileImage}
            verification={status}
          />
          <ButtonBase onClick={handleOpenMenu}>
            <MoreHorizIcon fontSize="small" />
          </ButtonBase>
          <DropdownMenu
            anchor={menuAnchorEl}
            allowComplaint={allowComplaint}
            onClose={handleCloseMenu}
            onComplaint={handleOpenComplaintPopup}
          />
        </Grid>
        <Grid container>
          <Box
            dangerouslySetInnerHTML={{ __html: HTML }}
            sx={{
              '& p': {
                my: 0.5,
              },
            }}
          />
        </Grid>
        <Grid container alignItems="center">
          {ratingElement}
          <ButtonBase onClick={handleAddComment} sx={{ ml: 1 }}>
            <CommentsIcon width="20" height="20" />
          </ButtonBase>
        </Grid>
        {addCommentElement}
      </Grid>
      <Divider />
    </>
  );
};

Comment.defaultProps = {
  username: '',
  profileImage: '',
  openNeedAuthPopup: () => null,
  parentId: null,
  verification: {},
};

Comment.propTypes = {
  username: PropTypes.string,
  profileImage: PropTypes.string,
  HTML: PropTypes.string.isRequired,
  openNeedAuthPopup: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  parentId: PropTypes.any,
  commentId: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  userVote: PropTypes.number.isRequired,
  verification: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
  ),
};

export default Comment;
