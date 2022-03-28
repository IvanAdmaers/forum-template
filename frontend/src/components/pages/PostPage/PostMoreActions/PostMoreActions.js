import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Dialog,
  ButtonBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreHoriz as MoreHorizIcon,
  AccountCircle as AccountCircleIcon,
  Flag as FlagIcon,
  FileCopy as FileCopyIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import MyLink from 'components/MyLink';

const PostMoreActions = ({
  author,
  allowPin,
  pinned,
  allowEdit,
  editLink,
  onPin,
  onCopy,
  allowComplaint,
  onComplaint,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleCopy = () => {
    onCopy();
    setIsDialogOpen(false);
  };

  const handlePinAction = () => {
    setIsPinned((prevState) => !prevState);
    onPin();
  };

  const pinPostIcon = pinned ? <LinkOffIcon /> : <LinkIcon />;

  const pinPostListItemTextElement = pinned ? (
    <ListItemText primary="Unpin" />
  ) : (
    <ListItemText primary="Pin" />
  );

  return (
    <>
      <Dialog
        aria-labelledby="simple-dialog-title"
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xs"
      >
        <List>
          <ListItem onClick={handleCopy} button>
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary="Copy link" />
          </ListItem>
          <ListItem component={MyLink} href={`/user/${author}`} button>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Author Profile" />
          </ListItem>
          <ListItem disabled={!allowComplaint} onClick={onComplaint} button>
            <ListItemIcon>
              <FlagIcon />
            </ListItemIcon>
            <ListItemText primary="Complaint" />
          </ListItem>
          {allowPin && (
            <ListItem disabled={isPinned} onClick={handlePinAction} button>
              <ListItemIcon>{pinPostIcon}</ListItemIcon>
              {pinPostListItemTextElement}
            </ListItem>
          )}
          {allowEdit && (
            <ListItem component={MyLink} href={editLink} button>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </ListItem>
          )}
        </List>
      </Dialog>
      <ButtonBase centerRipple onClick={handleOpenDialog}>
        <MoreHorizIcon />
      </ButtonBase>
    </>
  );
};

PostMoreActions.defaultProps = {
  onCopy: () => null,
  onPin: () => null,
  allowPin: false,
  allowEdit: false,
  editLink: '',
  pinned: false,
};

PostMoreActions.propTypes = {
  author: PropTypes.string.isRequired,
  onCopy: PropTypes.func,
  onPin: PropTypes.func,
  allowPin: PropTypes.bool,
  pinned: PropTypes.bool,
  allowEdit: PropTypes.bool,
  editLink: PropTypes.string,
  allowComplaint: PropTypes.bool.isRequired,
  onComplaint: PropTypes.func.isRequired,
};

export default PostMoreActions;
