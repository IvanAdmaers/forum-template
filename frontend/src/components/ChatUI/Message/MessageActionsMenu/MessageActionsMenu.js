import PropTypes from 'prop-types';
import { Menu, MenuItem } from '@mui/material';

const MessageActionsMenu = ({
  isOpen,
  anchorElement,
  onClose,
  onReply,
  onReport,
}) => (
  <Menu anchorEl={anchorElement} open={isOpen} onClose={onClose}>
    <MenuItem onClick={onReply}>Reply</MenuItem>
    <MenuItem onClick={onReport}>Report</MenuItem>
  </Menu>
);

MessageActionsMenu.defaultProps = {
  anchorElement: null,
};

MessageActionsMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  anchorElement: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  onReport: PropTypes.func.isRequired,
};

export default MessageActionsMenu;
