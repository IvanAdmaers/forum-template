import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import { nextReduxCookieMiddleware } from 'next-redux-cookie-wrapper';

import rootReducer from 'reducers/rootReducer';

// Connection redux devtools if mode does not equal production
const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }

  return applyMiddleware(...middleware);
};

// Combine reducers
const combinedReducer = combineReducers(rootReducer);

// Storage initialization
const initStore = () => {
  return createStore(
    combinedReducer,
    bindMiddleware([
      nextReduxCookieMiddleware({ subtrees: ['three'] }),
      thunkMiddleware,
    ])
  );
};

// Export an assembled wrapper
export const wrapper = createWrapper(initStore);
