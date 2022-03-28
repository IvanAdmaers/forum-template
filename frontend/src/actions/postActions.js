import {
  FETCH_POST_FAILURE,
  FETCH_POST_LOADING,
  FETCH_POST_SUCCESS,
  FETCH_POST_USER_SUCCESS,
  RATE_POST_SUCCESS,
} from 'constants/actionTypes';
import {
  getPost as getPostAPI,
  getPostUserData,
  votePost as votePostAPI,
} from 'api';

const loading = () => ({ type: FETCH_POST_LOADING });
const failure = (error = '') => ({ type: FETCH_POST_FAILURE, payload: error });

export const getPost =
  (slug = '') =>
  async (dispatch) => {
    try {
      await dispatch(loading());

      const post = await getPostAPI(slug);

      if (!post) {
        return dispatch(failure('Post not found'));
      }

      if (post.error) {
        return dispatch(failure(post.error));
      }

      return dispatch({
        type: FETCH_POST_SUCCESS,
        payload: {
          post: post.post,
          author: post.author,
          group: post.group || null,
          rating: post.rating.rating,
        },
      });
    } catch (e) {
      console.log(e);
      return dispatch(failure('Error loading post'));
    }
  };

export const getUserData =
  (slug = '') =>
  async (dispatch) => {
    try {
      await dispatch(loading());

      const userData = await getPostUserData(slug);

      return dispatch({
        type: FETCH_POST_USER_SUCCESS,
        payload: {
          user: userData.user,
          vote: userData.vote,
        },
      });
    } catch (e) {
      console.log(e);
      return dispatch(failure('Error getting user data'));
    }
  };

export const votePost =
  (slug = '', vote = 0) =>
  async (dispatch) => {
    try {
      dispatch(loading());

      await votePostAPI(slug, vote);

      return dispatch({
        type: RATE_POST_SUCCESS,
        payload: vote,
      });
    } catch (e) {
      console.log(e);
      return dispatch(failure('Error getting user data'));
    }
  };
