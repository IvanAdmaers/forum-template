import PropTypes from 'prop-types';
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

import MyLink from 'components/MyLink';
import Popup from '../Popup';

const DirectLink = ({ type, children, underline }) => {
  const url = type === 'signin' ? 'login' : 'sign-up';

  return (
    <MyLink underline={underline} href={`/${url}`}>
      {children}
    </MyLink>
  );
};

DirectLink.defaultProps = {
  underline: 'always',
};

DirectLink.propTypes = {
  type: PropTypes.oneOf(['signin', 'signup']),
  underline: PropTypes.string,
  children: PropTypes.node,
};

const NeedAuthPopup = ({ open, onClose }) => {
  return (
    <Popup
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
        &#9888; Authorization required &#9888;
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Authorization is required to proceed. You can{' '}
          <DirectLink type="signin">sign in</DirectLink> now, or{' '}
          <DirectLink type="signup">sign up</DirectLink> if you have you don't
          have an account yet.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <DirectLink underline="none" type="signin">
          <Button variant="outlined" color="primary">
            Login
          </Button>
        </DirectLink>
        <DirectLink underline="none" type="signup">
          <Button variant="contained" color="primary">
            Sign up
          </Button>
        </DirectLink>
      </DialogActions>
    </Popup>
  );
};

NeedAuthPopup.defaultProps = {
  open: false,
  onClose: () => {},
};

NeedAuthPopup.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default NeedAuthPopup;
