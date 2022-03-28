import {
  SEARCH_LOADING,
  SEARCH_FAILURE,
  FETCH_SEARCH_SUCCESS,
} from 'constants/actionTypes';
import { search as searchAPI } from 'api';

const loading = () => (dispatch) => dispatch({ type: SEARCH_LOADING });
const failure =
  (error = '') =>
  (dispatch) =>
    dispatch({ type: SEARCH_FAILURE, payload: error });

export const fetchSearchData =
  (by = '', q = '', page = 1) =>
  async (dispatch) => {
    try {
      await dispatch(loading());

      const { error, results, currentPage, numberOfPages } = await searchAPI(
        by,
        q,
        page
      );

      if (error) {
        return dispatch(failure(error));
      }

      const payload = {
        data: results,
        currentPage,
        numberOfPages,
      };

      return dispatch({ type: FETCH_SEARCH_SUCCESS, payload });
    } catch (e) {
      console.log(e);
      return dispatch(failure('Search error'));
    }
  };
