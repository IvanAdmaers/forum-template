import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  ButtonBase,
  Button,
  CardMedia,
  Divider,
  Box,
} from '@mui/material';

import { Avatar, Separator } from 'components/UserUI';
import MyLink from 'components/MyLink';

import {
  UpvoteIcon,
  DownvoteIcon,
  CommentsIcon,
  ShareIcon,
} from 'components/Icons';

import { getPostStatistik, postDate } from 'utills';

const MobilePostItem = ({ onVote, onCopyLink, onHide, onReport, post }) => {
  const {
    title,
    author,
    authorImage,
    link,
    createdAt,
    preview,
    voteState,
    score,
    commentsCount,
    pinned,
  } = post;

  const date = postDate(createdAt);

  const handleCopyLink = () => onCopyLink(link);

  const getRatingColor = (theme) => {
    if (voteState === 1) {
      return '#ff4500';
    }

    if (voteState === -1) {
      return '#7193ff';
    }

    return theme.palette.grey[300];
  };

  const isUpvote = voteState === 1;
  const isDownvote = voteState === -1;

  return (
    <Card>
      <CardContent sx={{ pb: 0 }}>
        <Grid
          container
          wrap="nowrap"
          align="center"
          justifyContent="space-between"
          sx={{ color: (theme) => theme.palette.grey[400] }}
        >
          <Grid container wrap="nowrap" alignItems="center">
            {author && (
              <>
                <MyLink href={`/user/${author}`}>
                  <Grid container alignItems="center">
                    <Avatar image={authorImage} username={author} />
                    <Typography
                      component="span"
                      variant="subtitle2"
                      noWrap
                      sx={{
                        ml: 1,
                        maxWidth: 90,
                      }}
                    >
                      {author}
                    </Typography>
                  </Grid>
                </MyLink>
                <Separator />
              </>
            )}
            <Typography component="span" variant="subtitle2">
              {date}
            </Typography>
            {pinned && <span>&nbsp; &#128204;</span>}
          </Grid>
        </Grid>
        <ButtonBase
          component="div"
          sx={{
            display: 'block',
            my: 1,
          }}
        >
          <MyLink href={link}>
            <Grid container wrap="nowrap" justifyContent="space-between">
              <Typography
                component="h2"
                variant="h6"
                sx={{
                  lineHeight: 1.3,
                  fontWeight: 400,
                  margin: '5px 0',
                  fontSize: '1.1rem',
                }}
              >
                {title}
              </Typography>
              {preview && (
                <Grid>
                  <CardMedia
                    image={preview.url}
                    alt="post image"
                    sx={{
                      width: 60,
                      height: 60,
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </MyLink>
        </ButtonBase>
      </CardContent>
      <CardActions sx={{ padding: (theme) => theme.spacing(0, 2, 2, 2) }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <div>
            <Button
              disableRipple
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            >
              <ButtonBase onClick={onVote} component="div" data-action="upvote">
                <UpvoteIcon active={isUpvote} />
              </ButtonBase>
              <Box
                component="span"
                sx={{
                  color: (theme) => getRatingColor(theme),
                  mx: 1,
                }}
              >
                {getPostStatistik(score)}
              </Box>
              <ButtonBase
                onClick={onVote}
                component="div"
                data-action="downvote"
              >
                <DownvoteIcon active={isDownvote} />
              </ButtonBase>
            </Button>
            <MyLink href={link}>
              <Button disableRipple variant="outlined" size="small">
                <CommentsIcon
                  sx={{ fill: (theme) => theme.palette.grey[300] }}
                />
                <Box component="span" sx={{ ml: 1 }}>
                  {getPostStatistik(commentsCount)}
                </Box>
              </Button>
            </MyLink>
          </div>
          <div>
            <ButtonBase
              onClick={handleCopyLink}
              sx={{
                padding: 1,
                border: (theme) => `1px solid ${theme.palette.grey[600]}`,
                borderRadius: '50%',
              }}
            >
              <ShareIcon sx={{ fill: (theme) => theme.palette.grey[300] }} />
            </ButtonBase>
          </div>
        </Grid>
      </CardActions>
      <Divider light />
    </Card>
  );
};

MobilePostItem.defaultProps = {
  post: {},
  onVote: () => {},
  onCopyLink: () => {},
  onHide: () => {},
  onReport: () => {},
};

MobilePostItem.propTypes = {
  post: PropTypes.object,
  onVote: PropTypes.func,
  onCopyLink: PropTypes.func,
  onHide: PropTypes.func,
  onReport: PropTypes.func,
};

export default MobilePostItem;
