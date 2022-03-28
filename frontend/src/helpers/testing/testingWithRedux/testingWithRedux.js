import { createStore, combineReducers } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';

import rootReducer from 'reducers/rootReducer';

export const store = createStore(combineReducers(rootReducer));

export const testingWithRedux = (children, reduxStore = store) => (
  <ReduxProvider store={reduxStore}>
    {children}
  </ReduxProvider>
);
