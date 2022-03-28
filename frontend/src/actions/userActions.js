import {
  signIn as apiSignIn,
  signUp as apiSignUp,
  changeAvatar as changeAvatarAPI,
  userLogout,
} from 'api';
import {
  FETCH_USER_LOADING,
  FETCH_USER_FAILURE,
  FETCH_USER_SUCCESS,
  USER_LOGOUT,
  SET_USER_AVATAR,
  SET_USER_AVATAR_FAILURE,
} from 'constants/actionTypes';

const loading = () => (dispatch) => {
  return dispatch({ type: FETCH_USER_LOADING });
};

const failure =
  (error = '') =>
  (dispatch) => {
    return dispatch({ type: FETCH_USER_FAILURE, payload: error });
  };

const success =
  (user = {}) =>
  (dispatch) => {
    return dispatch({ type: FETCH_USER_SUCCESS, payload: user });
  };

const set =
  (user = {}) =>
  (dispatch) => {
    return dispatch({ type: FETCH_USER_SUCCESS, payload: user });
  };

const logout = () => (dispatch) => {
  return dispatch({ type: USER_LOGOUT });
};

export const signIn =
  (username = '', password = '', router) =>
  async (dispatch) => {
    try {
      await dispatch(loading());

      const data = await apiSignIn(username, password);

      if (data.error) {
        return dispatch(failure(data.error));
      }

      dispatch(success(data.user));

      return router.push('/');
    } catch (e) {
      console.log(e);
      return dispatch(failure('Something went wrong'));
    }
  };

export const signUp =
  (email = '', username = '', password = '', router) =>
  async (dispatch) => {
    try {
      await dispatch(loading());

      const data = await apiSignUp(email, username, password);

      if (data.error) {
        return dispatch(failure(data.error));
      }

      dispatch(success(data.user));

      return router.push('/');
    } catch (e) {
      console.log(e);
      return dispatch(failure('Something went wrong'));
    }
  };

export const setUser =
  (userData = {}) =>
  (dispatch) => {
    return dispatch(set(userData));
  };

export const logoutUser = (router) => async (dispatch) => {
  try {
    await userLogout();

    await dispatch(logout());

    if (router) {
      return router.push('/');
    }

    return true;
  } catch (e) {
    console.log(e);
  }
};

const setAvatarFailure = (error = '') => ({
  type: SET_USER_AVATAR_FAILURE,
  payload: error,
});

export const changeAvatar = (file, notification) => async (dispatch) => {
  try {
    const { error, url } = await changeAvatarAPI(file);

    if (error) {
      return dispatch(setAvatarFailure(error));
    }

    notification('Avatar changed', 'success');

    return dispatch({ type: SET_USER_AVATAR, payload: url });
  } catch (e) {
    console.log(e);
    return dispatch(setAvatarFailure('Something went wrong'));
  }
};
