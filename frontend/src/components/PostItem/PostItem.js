import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Hidden } from '@mui/material';
import { useSelector } from 'react-redux';

import DesktopPostItem from './DesktopPostItem';
import MobilePostItem from './MobilePostItem';

import { useNotifications, useFetch } from 'hooks';

import withNeedAuth from 'hoc/withNeedAuth';

import { copyToBuffer } from 'utills';

const PostItem = ({ author, post, rating, popupElement, openPopup }) => {
  const { username: authorUsername, image: authorImage } = author;
  const { title, slug, createdAt, previewImage, pinned, commentsCount } = post;
  const { rating: postRatingValue, userVote: userVoteRating } = rating;

  const [userVote, setUserVote] = useState(userVoteRating);
  const [postRating, setPostRating] = useState(postRatingValue);

  const isLoggedIn = useSelector(({ user }) => user.isLoggedIn);

  const notification = useNotifications();

  const baseUrl = `/post/${slug}`;

  const [{ error: cancelvoteError }, doCancelVoteFetch] = useFetch(
    `${baseUrl}/0`
  );
  const [{ error: upvoteError }, doUpvoteFetch] = useFetch(`${baseUrl}/1`);
  const [{ error: downvoteError }, doDownvoteFetch] = useFetch(`${baseUrl}/-1`);

  // Fetch errors handler
  useEffect(() => {
    if (!cancelvoteError && !upvoteError && !downvoteError) return;

    const errorText = cancelvoteError || upvoteError || downvoteError;

    notification(errorText, 'error');
  }, [cancelvoteError, upvoteError, downvoteError, notification]);

  const handlePostVoteAction = (e) => {
    if (!isLoggedIn) {
      return openPopup();
    }

    const { action } = e.currentTarget.dataset;

    if (action === 'upvote') return upvote();

    return downvote();
  };

  const copyPostLink = async (link) => {
    try {
      const { origin } = window.location;
      await copyToBuffer(`${origin}${link}`);

      return notification('Successfully copied', 'success');
    } catch (e) {
      console.log(e);
      return notification('Copy error', 'error');
    }
  };

  const hidePost = () => {
    console.log('hide post');
  };

  const reportPost = () => {
    console.log('report post');
  };

  const props = {
    onVote: handlePostVoteAction,
    onCopyLink: copyPostLink,
    onHide: hidePost,
    onReport: reportPost,
    post: {
      author: authorUsername,
      authorImage,
      title,
      link: `/post/${slug}`,
      createdAt,
      preview: previewImage,
      voteState: userVote,
      score: postRating,
      commentsCount,
      commentsCountText: 'comments',
      pinned,
    },
  };

  const voteMethod = 'PUT';

  const upvote = () => {
    if (userVote === 1) return cancelvote('upvote');

    const count = userVote === -1 ? 2 : 1;

    doUpvoteFetch({ method: voteMethod });
    setUserVote(1);
    setPostRating((prevState) => prevState + count);
  };

  const downvote = () => {
    if (userVote === -1) return cancelvote('downvote');

    const count = userVote === 1 ? 2 : 1;

    doDownvoteFetch({ method: voteMethod });
    setUserVote(-1);
    setPostRating((prevState) => prevState - count);
  };

  const cancelvote = (lastAction = '') => {
    doCancelVoteFetch({ method: voteMethod });
    setUserVote(0);

    if (lastAction === 'upvote') {
      return setPostRating((prevState) => prevState - 1);
    }

    return setPostRating((prevState) => prevState + 1);
  };

  return <>
    {popupElement}
    <Hidden smDown>
      <DesktopPostItem {...props} />
    </Hidden>
    <Hidden smUp>
      <MobilePostItem {...props} />
    </Hidden>
  </>;
};

PostItem.defaultProps = {
  author: {},
  post: {},
  rating: {},
};

PostItem.propTypes = {
  author: PropTypes.object,
  post: PropTypes.object,
  rating: PropTypes.object,
  popupElement: PropTypes.node.isRequired,
  openPopup: PropTypes.func.isRequired,
};

export default withNeedAuth(PostItem);
