import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import {
  closeComplaintPopup,
  setComplaintReason,
  submitComplaint,
} from 'actions/complaintActions';

import { useNotifications } from 'hooks';

const ComplaintPopup = () => {
  const { type, id, open, reason, loading, error } = useSelector(
    ({ complaint }) => complaint
  );

  const dispatch = useDispatch();

  const notification = useNotifications();

  useEffect(() => {
    if (!error) return;

    notification(error, 'error');
  }, [error, notification]);

  const handleSuccess = () =>
    notification('Complaint sent successfully', 'success');

  const handleClose = () => dispatch(closeComplaintPopup());

  const handleReason = ({ target }) =>
    dispatch(setComplaintReason(target.value));

  const handleSubmit = () => {
    if (!reason.trim().length) {
      return notification('Enter the reason for the complaint', 'error');
    }

    dispatch(submitComplaint(type, id, reason, handleSuccess));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle align="center">Reasons for the complaint</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Enter the reasons for the complaint"
          value={reason}
          onChange={handleReason}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={loading || !reason.length}
          onClick={handleSubmit}
          variant="outlined"
          color="secondary"
        >
          Send
        </Button>
        <Button
          disabled={loading}
          onClick={handleClose}
          variant="contained"
          color="primary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComplaintPopup;
