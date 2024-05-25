import { combineReducers } from 'redux';

import authReducer from './auth';

// Combine all reducers.

const rootReducer = combineReducers({
  auth: authReducer
});

export default rootReducer;
