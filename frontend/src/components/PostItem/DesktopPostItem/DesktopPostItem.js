import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  ButtonBase,
  Typography,
  Divider,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ArrowDropUp as ArrowDropUpIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ChatBubble as ChatBuddleIcon,
  Share as ShareIcon,
  FileCopy as FileCopyIcon,
} from '@mui/icons-material';

import PostPreviewImage from './PostPreviewImage';
import MyLink from 'components/MyLink';

import { postDate, getPostStatistik } from 'utills';

const DesktopPostItem = ({ onVote, onCopyLink, onHide, onReport, post }) => {
  const [shareMenuEl, setShareMenuEl] = useState(null);

  const handleOpenShareMenu = (e) => setShareMenuEl(e.currentTarget);
  const handleCloseShareMenu = () => setShareMenuEl(null);

  const handleCopyPostLink = () => {
    onCopyLink(link);
    handleCloseShareMenu();
  };

  const {
    title,
    author,
    link,
    createdAt,
    preview,
    voteState,
    score,
    commentsCount,
    commentsCountText,
    pinned,
  } = post;

  const {
    url: previewURL,
    width: previewWidth,
    height: previewHeight,
  } = preview || {};

  const date = postDate(createdAt);

  const getRatingColor = (icon = '') => {
    if ((icon === 'upvote' || icon === 'text') && voteState && voteState === 1)
      return '#ff4500';
    if (
      (icon === 'downvote' || icon === 'text') &&
      voteState &&
      voteState === -1
    )
      return '#7193ff';

    return '';
  };

  return (
    <Card>
      <Grid container wrap="nowrap">
        <Grid item>
          <CardActions>
            <Grid>
              <ButtonBase data-action="upvote" onClick={onVote} centerRipple>
                <ArrowDropUpIcon
                  fontSize="large"
                  sx={{
                    color: getRatingColor('upvote'),
                  }}
                />
              </ButtonBase>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: getRatingColor('text'),
                }}
              >
                {getPostStatistik(score)}
              </Typography>
              <ButtonBase data-action="downvote" onClick={onVote} centerRipple>
                <ArrowDropDownIcon
                  fontSize="large"
                  sx={{
                    color: getRatingColor('downvote'),
                  }}
                />
              </ButtonBase>
            </Grid>
          </CardActions>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item sx={{ width: '100%' }}>
          <CardContent
            sx={{
              padding: 1,
              '&:last-child': {
                paddingBottom: 0,
              },
            }}
          >
            {author && (
              <Typography variant="caption">
                From <MyLink href={`/user/${author}`}>{author}</MyLink> {date}
              </Typography>
            )}
            {pinned && <span>&nbsp; &#128204;</span>}
            <ButtonBase component="div" sx={{ display: 'block' }}>
              <MyLink href={link}>
                <Typography component="h2" variant="h6">
                  {title}
                </Typography>
              </MyLink>
            </ButtonBase>
            {preview && (
              <PostPreviewImage
                link={link}
                src={previewURL}
                width={previewWidth}
                height={previewHeight}
                alt={`post ${title} preview`}
              />
            )}
            <CardActions sx={{ pl: 0 }}>
              <MyLink href={link}>
                <Button startIcon={<ChatBuddleIcon />}>
                  {getPostStatistik(commentsCount)} {commentsCountText}
                </Button>
              </MyLink>
              <div>
                <Button
                  aria-controls="share-menu"
                  aria-haspopup="true"
                  onClick={handleOpenShareMenu}
                  startIcon={<ShareIcon />}
                >
                  Share
                </Button>
                <Menu
                  id="share-menu"
                  anchorEl={shareMenuEl}
                  keepMounted
                  open={Boolean(shareMenuEl)}
                  onClose={handleCloseShareMenu}
                >
                  <MenuItem onClick={handleCopyPostLink}>
                    <FileCopyIcon fontSize="small" sx={{ mr: 1 }} /> Copy link
                  </MenuItem>
                </Menu>
              </div>
            </CardActions>
          </CardContent>
        </Grid>
      </Grid>
      <Divider light />
    </Card>
  );
};

DesktopPostItem.defaultProps = {
  post: {},
  onVote: () => {},
  onCopyLink: () => {},
  onHide: () => {},
  onReport: () => {},
};

DesktopPostItem.propTypes = {
  post: PropTypes.object,
  onVote: PropTypes.func,
  onCopyLink: PropTypes.func,
  onHide: PropTypes.func,
  onReport: PropTypes.func,
};

export default DesktopPostItem;
