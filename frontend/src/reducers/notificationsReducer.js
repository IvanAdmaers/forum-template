import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  count: 1,
};

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.notifications };

    default:
      return state;
  }
};

export default notificationsReducer;
