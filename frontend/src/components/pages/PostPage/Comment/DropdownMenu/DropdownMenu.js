import PropTypes from 'prop-types';
import {
  Menu,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Flag as FlagIcon } from '@mui/icons-material';

const DropdownMenu = ({ anchor, onClose, allowComplaint, onComplaint }) => {
  const handleClose = () => onClose();

  return (
    <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={handleClose}>
      <List>
        <ListItem disabled={!allowComplaint} onClick={onComplaint} button>
          <ListItemIcon>
            <FlagIcon />
          </ListItemIcon>
          <ListItemText primary="Complaint" />
        </ListItem>
      </List>
    </Menu>
  );
};

DropdownMenu.defaultProps = {
  anchor: null,
};

DropdownMenu.propTypes = {
  anchor: PropTypes.object,
  allowComplaint: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onComplaint: PropTypes.func.isRequired,
};

export default DropdownMenu;
