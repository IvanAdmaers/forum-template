import PropTypes from 'prop-types';
import { Dialog, DialogTitle } from '@mui/material';

const MyPopup = ({ isOpen, title, children, onClose, fullWidth }) => {
  const titleElement = title && <DialogTitle align="center">{title}</DialogTitle>;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth={fullWidth}>
      {titleElement}
      {children}
    </Dialog>
  );
};

MyPopup.defaultProps = {
  title: '',
  fullWidth: false,
};

MyPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
};

export default MyPopup;
