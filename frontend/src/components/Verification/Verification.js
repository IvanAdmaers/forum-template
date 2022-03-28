import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Button,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';

import MyPopup from 'components/MyPopup';

import { useFetch, useNotifications } from 'hooks';

const Verification = ({ verification, type, id, onChange }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const verificationType = verification ? 'remove' : 'add';

  const notification = useNotifications();

  // Fetch
  const [{ isLoading, response, error }, doFetch] = useFetch(
    `/verification/${verificationType}`
  );

  const buttonText = verification ? 'Remove verification' : 'Add verification';
  const buttonVarian = verification ? 'outlined' : 'contained';

  const popupTitle = `${type} verification`;

  const handlePopupOpen = () => setIsPopupOpen(true);
  const handlePopupClose = () => setIsPopupOpen(false);
  const handleInput = ({ target }) => setVerificationMessage(target.value);

  // Fetch success
  useEffect(() => {
    if (!response) return;
    notification('Success', 'success');

    handlePopupClose();

    const status = Boolean(response.added);

    onChange(status);

    setVerificationMessage('');
  }, [response, notification, onChange]);

  // Fetch error
  useEffect(() => {
    if (!error) return;

    notification(error, 'error');
  }, [error, notification]);

  const handleAction = () => {
    if (verification) {
      return handleSubmit();
    }

    return handlePopupOpen();
  };

  const handleSubmit = () => {
    const method = 'POST';

    const body = {
      verification: {
        type,
        id,
      },
    };

    if (verificationMessage) {
      body.verification.message = verificationMessage;
    }

    return doFetch({ method, body });
  };

  return (
    <>
      <Button
        variant={buttonVarian}
        size="small"
        color="primary"
        onClick={handleAction}
        disabled={isLoading}
      >
        {buttonText}
      </Button>
      <MyPopup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        title={popupTitle}
        fullWidth
      >
        <DialogContent>
          <TextField
            value={verificationMessage}
            onChange={handleInput}
            placeholder="Verification message"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            variant="contained"
            color="primary"
          >
            Add verification
          </Button>
        </DialogActions>
      </MyPopup>
    </>
  );
};

Verification.propTypes = {
  verification: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['user', 'group']),
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Verification;
