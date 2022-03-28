import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import { UserHead } from 'components/UserUI';
import Group from 'components/pages/PostPage/Group';
import PostMoreActions from 'components/pages/PostPage/PostMoreActions';
import Rating from 'components/Rating';
import CommentsRating from 'components/CommentsRating';
import Share from 'components/Share';
import NSFW from 'components/pages/PostPage/NSFW';
import MyLink from 'components/MyLink';
import PostComments from 'components/pages/PostPage/PostComments';
import ComplaintPopup from './ComplaintPopup';

import withNeedAuth from 'hoc/withNeedAuth';

import { useNotifications, useFetch } from 'hooks';

import { copyToBuffer } from 'utills';

import { getUserData, votePost } from 'actions/postActions';
import { openComplaintPopup } from 'actions/complaintActions';

const PostPage = ({ popupElement, openPopup }) => {
  const [didMount, setDidMount] = useState(false);
  const [isCommentActionsOpen, setIsCommentActionsOpen] = useState(false);
  const [comments, setComments] = useState([]);

  const post = useSelector(({ post }) => post);

  const router = useRouter();

  const { user: currentUser, isLoggedIn } = useSelector(({ user }) => user);
  const currentUserUsername = currentUser?.username;

  const {
    id: postId,
    title,
    slug,
    body,
    isNSFW,
    createdAt,
    commentsCount,
    pinned,
  } = post.data || {};
  const { HTML } = body || {};
  const { username, image } = post.author || {};
  const { slug: groupSlug, image: groupImage } = post.group || {};
  const { rating, vote: userVote } = post || {};

  const postDate = new Date(createdAt).getTime();

  const dispath = useDispatch();

  const notification = useNotifications();

  // Post comments fetch
  const [
    {
      error: postCommentsError,
      isLoading: postCommentsIsLoading,
      response: postCommentsResponse,
    },
    doPostCommentsFetch,
  ] = useFetch(`/comments/${slug}`);

  // Post comments fetch error
  useEffect(() => {
    if (!postCommentsError) return;

    notification(postCommentsError, 'error');
  }, [postCommentsError, notification]);

  // Post comments fetch response
  useEffect(() => {
    if (!postCommentsResponse) return;

    const { comments } = postCommentsResponse;

    setComments(comments);
  }, [postCommentsResponse]);

  useEffect(() => {
    if (didMount || !post.data) return;

    setDidMount(true);

    dispath(getUserData(slug));

    const method = 'GET';

    doPostCommentsFetch({ method });
  }, [didMount, dispath, post.data, slug, doPostCommentsFetch]);

  const handleVote = (vote = 0) => {
    return dispath(votePost(slug, vote));
  };

  const handleShare = async () => {
    const text = {
      success: 'Link to page successfully copied',
      error: 'Failed to copy page link',
    };

    try {
      const { origin, pathname } = window.location;

      await copyToBuffer(`${origin}${pathname}`);
      return notification(text.success, 'success');
    } catch (e) {
      return notification(text.error, 'error');
    }
  };

  const handleCommentReport = () => {
    console.log('Comment report');
    handleCommentActions();
  };

  // const handleLeaveComment = () =>
  //   setIsLeaveCommentOpen((prevState) => !prevState);
  const handleCommentActions = () =>
    setIsCommentActionsOpen((prevState) => !prevState);

  const addNewComment = (parentId, comment, newComment) => {
    const { id } = comment.comment;
    const { children } = comment;

    if (children) {
      comment.children = children.map((child) =>
        addNewComment(parentId, child, newComment)
      );
    }

    if (parentId === id) {
      const newChildrenValue =
        children === null ? [newComment] : [...children, newComment];

      comment.children = newChildrenValue;
    }

    return comment;
  };

  const handleNewComment = (newComment) => {
    const { parentId } = newComment.comment;

    const newComments = comments.map((comment) =>
      addNewComment(parentId, comment, newComment)
    );

    if (!parentId) {
      return setComments([newComment, ...newComments]);
    }

    return setComments(newComments);
  };

  // Pin / unpin post
  const [pinAction, setPinAction] = useState('');

  const [{ error: pinPostError, response: pinPostResponse }, doPinPostFetch] =
    useFetch(`/post/${groupSlug}/${postId}?action=${pinAction}`);

  const handlePin = () => {
    const action = pinned ? 'unpin' : 'pin';

    setPinAction(action);
  };

  // Fetch pin / unpin post
  useEffect(() => {
    if (!pinAction) return;

    const method = 'POST';

    doPinPostFetch({ method });
  }, [pinAction, doPinPostFetch]);

  // Fetch pin / unpin post error or success
  useEffect(() => {
    if (!pinPostError && !pinPostResponse) return;

    const text = pinPostError || 'Success';
    const status = pinPostError ? 'error' : 'success';

    notification(text, status);
  }, [pinPostError, pinPostResponse, notification]);

  const allowPin = post.group && username === currentUserUsername;

  const allowEdit = currentUserUsername === username;
  const postEditLink = `/post/edit/${slug}`;

  const allowComplaint = isLoggedIn;

  const handleOpenComplainPopup = () =>
    dispath(openComplaintPopup('post', postId));

  // const leaveCommentElement = (
  //   <Dialog onClose={handleLeaveComment} open={isLeaveCommentOpen}>
  //     leave a comment bruh
  //   </Dialog>
  // );
  const editedWarningElement = router.query.edited && (
    <Box
      sx={{
        background: (theme) => theme.palette.grey[600],
        color: (theme) => theme.palette.common.white,
        borderRadius: 5,
        padding: 1,
        my: 1,
      }}
    >
      The post has been recently updated. Changes will take effect in a few seconds
    </Box>
  );

  const commentActionsElement = (
    <Dialog onClose={handleCommentActions} open={isCommentActionsOpen}>
      <List>
        <ListItem button component={MyLink} href="/">
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText>User Profile</ListItemText>
        </ListItem>
        <ListItem onClick={handleCommentReport} button>
          <ListItemIcon>
            <FlagIcon />
          </ListItemIcon>
          <ListItemText>Complaint</ListItemText>
        </ListItem>
      </List>
    </Dialog>
  );

  const NSFWElement = !isNSFW ? null : <NSFW />;

  const groupElement = post.group ? (
    <Group slug={groupSlug} image={groupImage} />
  ) : (
    <Box sx={{ mt: 1 }} />
  );

  if (!post.data) {
    return <div>Loading</div>;
  }

  return (
    <>
      <ComplaintPopup />
      <Paper>
        {popupElement}
        <Card>
          {groupElement}
          <CardActions sx={{ px: 1 }}>
            <Grid
              container
              wrap="nowrap"
              alignItems="center"
              justifyContent="space-between"
            >
              <div>
                <Grid container wrap="nowrap" alignItems="center">
                  <UserHead username={username} image={image} time={postDate} />
                </Grid>
                <Box sx={{ mt: 0.5 }}>{NSFWElement}</Box>
              </div>
              <div>
                <PostMoreActions
                  author={username}
                  allowPin={allowPin}
                  pinned={pinned}
                  onCopy={handleShare}
                  onPin={handlePin}
                  allowEdit={allowEdit}
                  editLink={postEditLink}
                  allowComplaint={allowComplaint}
                  onComplaint={handleOpenComplainPopup}
                />
              </div>
            </Grid>
          </CardActions>
          <CardContent sx={{ padding: (theme) => theme.spacing(0, 1, 1, 1) }}>
            {editedWarningElement}
            <Typography component="h1" variant="h6">
              {title}
            </Typography>
            <Box
              dangerouslySetInnerHTML={{ __html: HTML }}
              sx={{
                '& figure': {
                  margin: 0,
                },
                '& img': {
                  display: 'block',
                  width: '90%',
                  maxWidth: 500,
                  height: 'auto',
                  margin: 'auto',
                },
                '& a': {
                  textDecoration: 'underline',
                  color: (theme) => theme.palette.primary.light,
                },
                '& iframe': {
                  display: 'block',
                  maxWidth: '100%',
                  margin: 'auto',
                },
              }}
            />
          </CardContent>
          <CardActions>
            <Grid container justifyContent="space-between" alignItems="center">
              <Box sx={{ display: 'flex' }}>
                <Rating
                  score={rating}
                  voteState={userVote}
                  onVote={handleVote}
                  isLoggedIn={isLoggedIn}
                  openPopup={openPopup}
                />
                <Box sx={{ ml: 0.5 }} />
                <CommentsRating numComments={commentsCount} />
              </Box>
              <div>
                <Share onShare={handleShare} />
              </div>
            </Grid>
          </CardActions>
        </Card>
        <PostComments
          isLoading={postCommentsIsLoading}
          comments={comments}
          onNewComment={handleNewComment}
        />
      </Paper>
      {commentActionsElement}
    </>
  );
};

PostPage.propTypes = {
  popupElement: PropTypes.element.isRequired,
  openPopup: PropTypes.func.isRequired,
};

export default withNeedAuth(PostPage);
