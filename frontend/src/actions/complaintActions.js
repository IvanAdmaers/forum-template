import {
  COMPLAINT_OPEN_POPUP,
  COMPLAINT_CLOSE_POPUP,
  COMPLAINT_SET_REASON,
  COMPLAINT_SUBMIT_ERROR,
  COMPLAINT_SUBMIT_LOADING,
  COMPLAINT_SUBMIT_SUCCESS,
} from 'constants/actionTypes';

import { submitComplaint as submitComplaintAPI } from 'api';

const error = (text = '') => ({ type: COMPLAINT_SUBMIT_ERROR, payload: text });
const loading = () => ({ type: COMPLAINT_SUBMIT_LOADING });

export const openComplaintPopup = (type = '', id = '') => ({
  type: COMPLAINT_OPEN_POPUP,
  payload: { type, id },
});

export const closeComplaintPopup = () => ({ type: COMPLAINT_CLOSE_POPUP });

export const setComplaintReason = (reason = '') => ({
  type: COMPLAINT_SET_REASON,
  payload: reason,
});

export const submitComplaint =
  (type = '', id = '', reason = '', onSuccess = () => null) =>
  async (dispatch) => {
    try {
      await dispatch(loading());

      const res = await submitComplaintAPI(type, id, reason);

      if (res.error) {
        return dispatch(error(res.error));
      }

      onSuccess();

      return dispatch({ type: COMPLAINT_SUBMIT_SUCCESS });
    } catch (e) {
      console.log(e);
      return dispatch(error('Failed to send complaint'));
    }
  };
