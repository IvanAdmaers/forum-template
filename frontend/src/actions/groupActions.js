import {
  FETCH_GROUP_SUCCESS,
  FETCH_GROUP_FAILURE,
  FETCH_GROUP_LOADING,
  JOIN_GROUP_SUCCESS,
  UNJOIN_GROUP_SUCCESS,
  CHECK_IS_GROUP_MEMBER_SUCCESS,
  SET_GROUP_VERIFICATION,
} from 'constants/actionTypes';

import { getGroup, joinGroup, unjoinGroup, isGroupMember } from 'api';

const loading = () => ({ type: FETCH_GROUP_LOADING });

const failure = (error = '') => ({
  type: FETCH_GROUP_FAILURE,
  payload: error,
});

export const getGroupData =
  (slug = '') =>
  async (dispatch) => {
    try {
      dispatch(loading());

      const groupData = await getGroup(slug);

      if (groupData.error) {
        return dispatch(failure('Groups not found'));
      }

      return dispatch({
        type: FETCH_GROUP_SUCCESS,
        payload: groupData.group,
      });
    } catch (e) {
      console.log(e);
      return dispatch(failure('Something went wrong'));
    }
  };

const getGroupActionData = (action = '') => {
  switch (action) {
    case 'join':
      return [joinGroup, JOIN_GROUP_SUCCESS];

    case 'unjoin':
      return [unjoinGroup, UNJOIN_GROUP_SUCCESS];

    default:
      throw new Error('Group action is unknown');
  }
};

export const groupAction =
  (action = '', slug = '') =>
  async (dispatch) => {
    try {
      const [method, actionType] = getGroupActionData(action);

      dispatch(loading());

      const { error } = await method(slug);

      if (error) {
        return dispatch(failure(error));
      }

      return dispatch({ type: actionType });
    } catch (e) {
      console.log(e);
      return dispatch(failure('Something went wrong'));
    }
  };

export const checkIsMember =
  (slug = '') =>
  async (dispatch) => {
    try {
      dispatch(loading());

      const { isMember } = await isGroupMember(slug);

      return dispatch({
        type: CHECK_IS_GROUP_MEMBER_SUCCESS,
        payload: isMember,
      });
    } catch (e) {
      console.log(e);
      return dispatch(failure('Something went wrong'));
    }
  };

export const setGroupVerification = (status) => ({
  type: SET_GROUP_VERIFICATION,
  payload: status,
});
