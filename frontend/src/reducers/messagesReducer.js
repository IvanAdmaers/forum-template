import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  count: 2,
};

const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.messages };

    default:
      return state;
  }
};

export default messagesReducer;
