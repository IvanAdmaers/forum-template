import PropTypes from 'prop-types';
import { Dialog } from '@mui/material';

const Popup = ({ children, onClose, open, ...attrs }) => {
  return (
    <Dialog open={open} onClose={onClose} {...attrs}>
      {children}
    </Dialog>
  );
};

Popup.defaultProps = {
  onClose: () => {},
  open: false,
};

Popup.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  children: PropTypes.node,
};

export default Popup;
