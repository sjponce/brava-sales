import { combineReducers } from 'redux';
import authReducer from './auth';
import themeReducer from './themeReducer';

// Combine all reducers.

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
});

export default rootReducer;
