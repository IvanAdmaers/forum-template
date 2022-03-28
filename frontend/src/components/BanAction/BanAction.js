import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Button,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

import { BanMarker } from 'components/UserUI';
import MyPopup from 'components/MyPopup';

import { useFetch, useNotifications } from 'hooks';

import banDurationOptions from './banDurationOptions';

const BanAction = ({ type, id }) => {
  const [banned, setBanned] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [insideComment, setInsideComment] = useState('');
  const [duration, setDuration] = useState('');

  const [{ error, isLoading, response }, doFetch] = useFetch('/ban');

  const notification = useNotifications();

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleInputChange = ({ target }) => {
    const field = target.dataset?.field || target.name;
    const { value } = target;

    switch (field) {
      case 'reason':
        return setReason(value);

      case 'insideComment':
        return setInsideComment(value);

      case 'duration':
        return setDuration(value);

      default:
        return console.log(`Unknown field ${field}`);
    }
  };

  const handleSubmit = () => {
    if (!reason.length) {
      return notification('Enter ban reason', 'error');
    }

    if (type === 'user' && duration === '') {
      return notification('Set ban duration', 'error');
    }

    const ban = {
      type,
      id,
      reason,
      insideComment,
    };

    if (duration) {
      ban.duration = duration;
    }

    const method = 'POST';

    doFetch({ method, body: { ban } });
  };

  useEffect(() => {
    if (!error) return;

    notification(error, 'error');
  }, [error, notification]);

  useEffect(() => {
    if (!response) return;

    notification(`${type} was successfully banned`, 'success');

    setBanned(true);
    closePopup();
  }, [response, type, notification]);

  const popupElement = (
    <MyPopup
      isOpen={isPopupOpen}
      title={`${type} ban`}
      onClose={closePopup}
      fullWidth
    >
      <DialogContent>
        <TextField
          inputProps={{ 'data-field': 'reason' }}
          value={reason}
          onChange={handleInputChange}
          label="Ban reason"
          fullWidth
          required
        />
        <TextField
          inputProps={{ 'data-field': 'insideComment' }}
          value={insideComment}
          onChange={handleInputChange}
          label="Ban inside comment"
          fullWidth
        />
        {type === 'user' && (
          <FormControl fullWidth>
            <InputLabel id="ban-duration-select">Duration</InputLabel>
            <Select
              id="ban-duration-select"
              name="duration"
              label="Ban duration"
              value={duration}
              onChange={handleInputChange}
            >
              {banDurationOptions.map(({ value, label }) => (
                <MenuItem key={`ban-option-${value}`} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isLoading}
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          To ban
        </Button>
      </DialogActions>
    </MyPopup>
  );

  const actionButtonElement = banned ? (
    <BanMarker />
  ) : (
    <Button
      variant="contained"
      color="primary"
      onClick={openPopup}
      size="small"
    >
      To ban
    </Button>
  );

  return (
    <>
      {actionButtonElement}
      {popupElement}
    </>
  );
};

BanAction.propTypes = {
  type: PropTypes.oneOf(['user', 'group']).isRequired,
  id: PropTypes.string.isRequired,
};

export default BanAction;
