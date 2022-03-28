// import { HYDRATE } from 'next-redux-wrapper';
import {
  FETCH_USER_LOADING,
  FETCH_USER_FAILURE,
  FETCH_USER_SUCCESS,
  USER_LOGOUT,
  SET_USER_AVATAR,
  SET_USER_AVATAR_FAILURE,
} from 'constants/actionTypes';
import { USER_LOCAL_STORAGE_VARIABLE } from 'constants/user';

const initialState = {
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // case HYDRATE:
    //   return { ...state, ...action.payload.user };

    case FETCH_USER_LOADING:
      return { ...state, loading: true };

    case FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        isLoggedIn: false,
        error: action.payload,
      };

    case FETCH_USER_SUCCESS: {
      const user = action.payload;

      localStorage.setItem(USER_LOCAL_STORAGE_VARIABLE, JSON.stringify(user));

      return {
        ...state,
        loading: false,
        error: null,
        isLoggedIn: true,
        user,
      };
    }

    case USER_LOGOUT:
      localStorage.removeItem(USER_LOCAL_STORAGE_VARIABLE);

      return {
        ...state,
        loading: false,
        error: null,
        isLoggedIn: false,
        user: null,
      };

    case SET_USER_AVATAR_FAILURE: {
      return {
        ...state,
        error: action.payload,
      };
    }

    case SET_USER_AVATAR:
      return {
        ...state,
        error: null,
        user: { ...state.user, image: action.payload },
      };

    default:
      return state;
  }
};

export default userReducer;
