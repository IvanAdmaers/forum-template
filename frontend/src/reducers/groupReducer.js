import { HYDRATE } from 'next-redux-wrapper';
import {
  FETCH_GROUP_SUCCESS,
  FETCH_GROUP_FAILURE,
  FETCH_GROUP_LOADING,
  JOIN_GROUP_SUCCESS,
  UNJOIN_GROUP_SUCCESS,
  CHECK_IS_GROUP_MEMBER_SUCCESS,
  SET_GROUP_VERIFICATION,
} from 'constants/actionTypes';

const initialState = {
  data: null,
  user: null, // member
  loading: false,
  error: null,
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.group };

    case FETCH_GROUP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_GROUP_SUCCESS:
      return { ...state, data: action.payload, loading: false, error: null };

    case FETCH_GROUP_LOADING:
      return { ...state, loading: true };

    case JOIN_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          isMember: true,
        },
        data: { ...state.data, membersCount: state.data.membersCount + 1 },
      };

    case UNJOIN_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        user: { ...state.user, isMember: false },
        data: { ...state.data, membersCount: state.data.membersCount - 1 },
      };

    case CHECK_IS_GROUP_MEMBER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: { ...state.user, isMember: action.payload },
      };

    case SET_GROUP_VERIFICATION:
      return {
        ...state,
        data: {
          ...state.data,
          verification: { ...state.data.verification, status: action.payload },
        },
      };

    default:
      return state;
  }
};

export default groupReducer;
