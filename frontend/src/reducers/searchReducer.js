import { HYDRATE } from 'next-redux-wrapper';

import {
  SEARCH_LOADING,
  SEARCH_FAILURE,
  FETCH_SEARCH_FAILURE,
  FETCH_SEARCH_SUCCESS,
} from 'constants/actionTypes';

const initialState = {
  tab: '',
  query: '',
  loading: false,
  data: [],
  error: '',
  currentPage: 1,
  numberOfPages: -1,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.search };

    case SEARCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SEARCH_LOADING:
      return { ...state, loading: true, error: '' };

    case FETCH_SEARCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_SEARCH_SUCCESS: {
      const { data, numberOfPages, currentPage } = action.payload;

      return {
        ...state,
        loading: false,
        error: '',
        data,
        numberOfPages,
        currentPage,
      };
    }

    default:
      return state;
  }
};

export default searchReducer;
