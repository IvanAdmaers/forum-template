import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Button, ButtonBase, Typography } from '@mui/material';

import { UpvoteIcon, DownvoteIcon } from 'components/Icons';

import { getPostStatistik } from 'utills';

const Rating = ({ score, voteState, onVote, isLoggedIn, openPopup }) => {
  const [isUpvote, setIsUpvote] = useState(voteState === 1);
  const [isDownvote, setIsDownvote] = useState(voteState === -1);
  const [stat, setStat] = useState(score);

  useEffect(() => {
    setIsUpvote(voteState === 1);
    setIsDownvote(voteState === -1);
  }, [voteState]);

  useEffect(() => {
    setStat(score);
  }, [score]);

  const changeStat = (value = 0) => {
    setStat((prevStat) => prevStat + value);
  };

  const handleVote = ({ currentTarget }) => {
    const { action } = currentTarget.dataset;

    if (!isLoggedIn) {
      return openPopup();
    }

    // Upvote
    if (action === 'upvote') {
      const upvoteChangeValue = isDownvote ? 2 : 1;

      setIsDownvote(false);

      if (!isUpvote) {
        onVote(1);
        changeStat(upvoteChangeValue);
        return setIsUpvote(true);
      }

      onVote(0);
      changeStat(-1);
      return setIsUpvote(false);
    }

    // Downvote
    const downvoteChangeValue = isUpvote ? -2 : -1;

    setIsUpvote(false);

    if (!isDownvote) {
      onVote(-1);
      changeStat(downvoteChangeValue);
      return setIsDownvote(true);
    }

    // Cancel vote

    const cancelVoteValue = isUpvote ? -1 : 1;

    onVote(0);
    changeStat(cancelVoteValue);
    return setIsDownvote(false);
  };

  const getRatingColor = () => {
    if (isUpvote) {
      return '#ff4500';
    }

    if (isDownvote) {
      return '#7193ff';
    }

    return '';
  };

  const rating = getPostStatistik(stat);

  return (
    <Button disableRipple variant="outlined" size="small">
      <ButtonBase
        component="span"
        onClick={handleVote}
        centerRipple
        data-action="upvote"
      >
        <UpvoteIcon active={isUpvote} />
      </ButtonBase>
      <Typography
        component="p"
        variant="subtitle2"
        color="textSecondary"
        sx={{
          mx: 0.5,
          color: getRatingColor(),
        }}
      >
        {rating}
      </Typography>
      <ButtonBase
        component="span"
        onClick={handleVote}
        centerRipple
        data-action="downvote"
      >
        <DownvoteIcon active={isDownvote} />
      </ButtonBase>
    </Button>
  );
};

Rating.defaultProps = {
  score: 0,
  voteState: 0,
  onVote: () => {},
  isLoggedIn: false,
  openPopup: () => {},
};

Rating.propTypes = {
  score: PropTypes.number,
  voteState: PropTypes.number,
  onVote: PropTypes.func,
  isLoggedIn: PropTypes.bool.isRequired,
  openPopup: PropTypes.func.isRequired,
};

export default Rating;
