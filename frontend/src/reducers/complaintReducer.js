import { HYDRATE } from 'next-redux-wrapper';

import {
  COMPLAINT_OPEN_POPUP,
  COMPLAINT_CLOSE_POPUP,
  COMPLAINT_SET_REASON,
  COMPLAINT_SUBMIT_ERROR,
  COMPLAINT_SUBMIT_LOADING,
  COMPLAINT_SUBMIT_SUCCESS,
} from 'constants/actionTypes';

const initialState = {
  open: false,
  loading: false,
  type: '',
  error: '',
  id: '',
  reason: '',
};

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.complaint };

    case COMPLAINT_OPEN_POPUP: {
      const { type, id } = action.payload;

      return { ...state, open: true, type, id };
    }

    case COMPLAINT_CLOSE_POPUP:
      return { ...state, open: false, reason: '', type: '', id: '' };

    case COMPLAINT_SET_REASON:
      return { ...state, reason: action.payload };

    case COMPLAINT_SUBMIT_LOADING:
      return { ...state, loading: true, error: '' };

    case COMPLAINT_SUBMIT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        reason: '',
        open: false,
      };

    case COMPLAINT_SUBMIT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        reason: '',
        open: false,
      };

    default:
      return state;
  }
};

export default notificationsReducer;
