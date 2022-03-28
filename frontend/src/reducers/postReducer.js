import { HYDRATE } from 'next-redux-wrapper';

import {
  FETCH_POST_FAILURE,
  FETCH_POST_SUCCESS,
  FETCH_POST_LOADING,
  FETCH_POST_USER_SUCCESS,
  RATE_POST_SUCCESS,
} from 'constants/actionTypes';

const getNewRatingValue = (prevVote = 0, currentVote = 0, rating = 0) => {
  switch (currentVote) {
    case 1: {
      const value = prevVote === -1 ? 2 : 1;

      return rating + value;
    }

    case -1: {
      const value = prevVote === 1 ? 2 : 1;

      return rating - value;
    }

    case 0: {
      const value = prevVote === 1 ? -1 : 1;

      return rating + value;
    }

    default:
      throw new Error('Current vote is unknown');
  }
};

const initialState = {
  data: null,
  author: null,
  loading: false,
  user: null,
  error: null,
  group: null,
  rating: null,
  vote: 0,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.post };

    case FETCH_POST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_POST_SUCCESS: {
      const { post, author, group, rating } = action.payload;

      return {
        ...state,
        loading: false,
        data: post,
        author,
        group,
        rating,
      };
    }

    case FETCH_POST_LOADING:
      return { ...state, loading: true };

    case FETCH_POST_USER_SUCCESS: {
      const { user, vote } = action.payload;

      return { ...state, loading: false, user, vote };
    }

    case RATE_POST_SUCCESS: {
      const { vote, rating } = state;
      const currentVote = action.payload;

      return {
        ...state,
        loading: false,
        vote: currentVote,
        rating: getNewRatingValue(vote, currentVote, rating),
      };
    }

    default:
      return state;
  }
};

export default postReducer;
